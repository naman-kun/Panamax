import React from "react";
import { NotionAISandbox } from "@/components/dashboard/NotionAISandbox";
import { SubPageProps } from "./SubPageCommon";

export function AISandboxPage({ source, destination, vesselClass, cargoQuantityMT }: SubPageProps) {
  return <NotionAISandbox source={source} destination={destination} vesselClass={vesselClass} cargoQuantityMT={cargoQuantityMT} />;
}
