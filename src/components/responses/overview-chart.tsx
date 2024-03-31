import type { FormResponse, FormViews } from "@prisma/client";
import React, { useMemo } from "react";
import type { DateRange } from "react-day-picker";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TProps = {
  formResponses: FormResponse[];
  formViews: FormViews[];
  dateRange: DateRange | undefined;
};
function OverViewChart({ formResponses, formViews, dateRange }: TProps) {
  // 1. get the number of responses per week
  const responsesPerWeek = useMemo(() => {
    const responsesPerWeek: Record<string, number> = {};
    formResponses.forEach((response) => {
      if (response.completed) {
        const date = new Date(response.createdAt);
        const week = date.toISOString().split("T")[0]!;
        if (responsesPerWeek[week]) {
          responsesPerWeek[week] += 1;
        } else {
          responsesPerWeek[week] = 1;
        }
      }
    });
    return responsesPerWeek;
  }, [formResponses]);

  // 2. get the number of views per week
  const viewsPerWeek = useMemo(() => {
    const viewsPerWeek: Record<string, number> = {};
    formViews.forEach((view) => {
      const date = new Date(view.createdAt);
      const week = date.toISOString().split("T")[0]!;
      if (viewsPerWeek[week]) {
        viewsPerWeek[week] += 1;
      } else {
        viewsPerWeek[week] = 1;
      }
    });
    return viewsPerWeek;
  }, [formViews]);

  // 3. get the number of starts per week, start = response, where completed = false
  const startsPerWeek = useMemo(() => {
    const startsPerWeek: Record<string, number> = {};
    formResponses.forEach((response) => {
      // if (!response.completed) {
      const date = new Date(response.createdAt);
      const week = date.toISOString().split("T")[0]!;
      if (startsPerWeek[week]) {
        startsPerWeek[week] += 1;
      } else {
        startsPerWeek[week] = 1;
      }
      // }
    });
    return startsPerWeek;
  }, [formResponses]);

  const weeks = useMemo(() => {
    const lo = new Date(
      Math.min(
        ...formResponses.map((r) => new Date(r.createdAt).getTime()),
        ...formViews.map((v) => new Date(v.createdAt).getTime())
      )
    );
    const hi = new Date(
      Math.max(
        ...formResponses.map((r) => new Date(r.createdAt).getTime()),
        ...formViews.map((v) => new Date(v.createdAt).getTime())
      )
    );

    // adjust lo and hi according to the date range
    if (dateRange?.from && dateRange?.to) {
      lo.setTime(dateRange.from.getTime());
      hi.setTime(dateRange.to.getTime());
    }

    const weeks = [];
    const curr = lo;
    while (curr <= hi) {
      weeks.push(curr.toISOString().split("T")[0]!);
      curr.setDate(curr.getDate() + 1);
    }
    return weeks;
  }, [formResponses, formViews, dateRange]);

  const data = useMemo(() => {
    return weeks.map((week) => {
      return {
        week: week,
        views: viewsPerWeek[week] ?? 0,
        starts: startsPerWeek[week] ?? 0,
        responses: responsesPerWeek[week] ?? 0,
      };
    });
  }, [responsesPerWeek, viewsPerWeek, weeks, startsPerWeek]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#242423" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload?.length) {
              return (
                <div className="rounded-lg border bg-background p-4 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Date
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {label}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Views
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[0]?.value}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Starts
                      </span>
                      <span className="font-bold">{payload[1]?.value}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Responses
                      </span>
                      <span className="font-bold">{payload[2]?.value}</span>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          }}
        />
        <XAxis dataKey="week" stroke="#888888" fontSize={12} />
        <YAxis stroke="#888888" fontSize={12} />
        <Legend />
        <Line
          dataKey="views"
          fill="currentColor"
          type={"monotone"}
          strokeWidth={2}
          stroke="hsl(221.2 83.2% 53.3%)"
          dot={false}
          opacity={0.5}
        />
        <Line
          dataKey="starts"
          fill="currentColor"
          type={"monotone"}
          strokeWidth={2}
          stroke="hsl(262.1 83.3% 57.8%)"
          dot={false}
          opacity={0.5}
        />
        <Line
          dataKey="responses"
          fill="currentColor"
          type={"monotone"}
          strokeWidth={2}
          stroke="hsl(346.8 77.2% 49.8%)"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default OverViewChart;
