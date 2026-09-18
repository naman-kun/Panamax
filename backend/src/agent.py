"""
agent.py
WHAT: Builds a LangGraph ReAct agent utilizing Google Gemini and Baltic Exchange custom tools.
"""
import os
from typing import Annotated
from typing_extensions import TypedDict
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition

# Load environment variables from .env file
load_dotenv()

# Import tools with fallback for direct vs module execution
try:
    from tools import predict_freight_index, explain_prediction, search_market_news
except ImportError:
    from src.tools import predict_freight_index, explain_prediction, search_market_news

# ---------------------------------------------------------------------------
# System prompt — injected into every agent invocation
# ---------------------------------------------------------------------------
FREIGHT_SYSTEM_PROMPT = """SYSTEM INSTRUCTIONS FOR FREIGHT RATE ESTIMATION:
You are an expert maritime freight estimator calculating freight rates between East Coast Indian ports and Baltic/Northern European ports.

FIXED ASSUMPTIONS (Do not alter):
- Cargo: General Cargo
- Freight/Volume Measurement: Tonnes (No separate CBM calculations)
- Currency: USD
- Routing: Baltic/Northern European routing
- Excluded: Storage, Detention, Demurrage

REQUIRED ESTIMATION FORMULA:
Total Estimated Voyage Cost = (Base voyage freight) + (Bunker/fuel component) + (Origin-port costs) + (Destination-port costs) + (Cargo-handling/stevedoring) + (Canal/route costs) + (Environmental/emissions costs) + (Security/insurance costs) + (Congestion/waiting costs) + (Documentation/agency costs) + (Applicable market adjustments/seasonality).

FINAL OUTPUT CALCULATION:
Freight Rate (USD/tonne) = Total Estimated Voyage Cost ÷ Cargo Tonnes

DATA GATHERING FRAMEWORK:
For every calculation, you must attempt to gather or estimate the following variables using your tools, prioritizing official port authorities, the Baltic Exchange, and UNCTAD:
1. Exact Port Pair (India to Europe, or Europe to India)
2. Shipment Quantity (Tonnes)
3. Vessel Type and Capacity (Tonnes/DWT)
4. Sailing Distance (Nautical miles) and Estimated Sailing Time (Days)
5. Bunker Price (USD/tonne) & Estimated Fuel Consumption (Tonnes/day)
6. Base Freight Benchmark (USD/tonne - prioritize Baltic Exchange)
7. Origin & Destination Port Tariffs: Harbour dues, Pilotage, Towage, Mooring, Stevedoring, Cargo handling, and other official charges.
8. Ancillary Costs: Canal/Route fees, Environmental/Emissions costs, Insurance, Security/War-risk premium, Documentation, Taxes, and Peak-season adjustments.
9. Market Context: Current congestion/waiting times and current exchange rates (convert EUR, PLN, INR to USD based on official central bank data).

Compile these factors, execute the required formula, and present your findings strictly in the required three-part executive report structure: (a) Forecasted Rate (USD/tonne), (b) Key Drivers, and (c) Market Context."""


class State(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]


def format_message_content(content) -> str:
    """Helper to cleanly extract display text from string or structured content blocks."""
    if isinstance(content, str):
        return content.strip()
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict) and "text" in item:
                parts.append(item["text"])
            elif isinstance(item, str):
                parts.append(item)
            elif hasattr(item, "text"):
                parts.append(item.text)
            else:
                parts.append(str(item))
        return "".join(parts).strip()
    return str(content).strip()


def build_app(model_name: str = None):
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError(
            "GOOGLE_API_KEY environment variable is missing. "
            "Please add your Gemini API key to the .env file in the project root."
        )

    # Use active supported model (gemini-2.5-flash) with env var override
    active_model = model_name or os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    llm = ChatGoogleGenerativeAI(model=active_model, temperature=0, google_api_key=api_key)
    tools = [predict_freight_index, explain_prediction, search_market_news]
    llm_with_tools = llm.bind_tools(tools)

    def chatbot(state: State):
        """
        Chatbot node: prepend the freight estimation system prompt as a
        SystemMessage on every invocation so the agent always operates
        within the defined data gathering framework and output structure.
        """
        system_msg = SystemMessage(content=FREIGHT_SYSTEM_PROMPT)
        # Prepend system message; existing messages follow
        messages = [system_msg] + list(state["messages"])
        return {"messages": [llm_with_tools.invoke(messages)]}

    graph_builder = StateGraph(State)
    graph_builder.add_node("chatbot", chatbot)
    graph_builder.add_node("tools", ToolNode(tools=tools))

    graph_builder.add_edge(START, "chatbot")
    graph_builder.add_conditional_edges("chatbot", tools_condition)
    graph_builder.add_edge("tools", "chatbot")

    return graph_builder.compile()


def main():
    try:
        app = build_app()
    except Exception as e:
        print(f"Initialization Error: {e}")
        return

    print("Baltic Freight Market Agent Initialized (Type 'quit' to exit)")
    print("-" * 65)

    while True:
        try:
            user_input = input("\nYou: ")
        except (EOFError, KeyboardInterrupt):
            print("\nExiting session.")
            break

        if user_input.strip().lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break

        if not user_input.strip():
            continue

        try:
            events = app.stream({"messages": [("user", user_input)]}, stream_mode="values")
            for event in events:
                latest_message = event["messages"][-1]
                if latest_message.type == "ai" and latest_message.content:
                    text = format_message_content(latest_message.content)
                    if text:
                        print(f"\nAgent: {text}")
        except Exception as e:
            print(f"\nExecution Error: {e}")


if __name__ == "__main__":
    main()