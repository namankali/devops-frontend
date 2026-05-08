import Server from "../service/Server";
import type { BuildDuration } from "../helper/types";
import { useQuery } from "@tanstack/react-query";

const useBuildDurationChart = () => {
  return useQuery({
    queryKey: ["build_duration_chart"],
    queryFn: async () => {
      const res = await Server.buildDurationChart();
      return (res.data as BuildDuration[]) ?? [];
    },
  });
};

export default useBuildDurationChart