import React from "react";
import { JobData } from "../interfaces";


export const JobsContext = React.createContext<JobData[]>([]);