import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function GraphView({ graph }: { graph: any }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container || !graph) return;
    container.innerHTML = "";

    const width = container.clientWidth || 900;
    const height = 520;

    const svg = d3
      .select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", `${height}px`);

    // --- defs (arrows + glow)
    const defs = svg.append("defs");

    defs
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 42)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "rgba(148,163,184,0.8)");

    defs
      .append("filter")
      .attr("id", "glow")
      .append("feGaussianBlur")
      .attr("stdDeviation", 6)
      .attr("result", "coloredBlur");

    const g = svg.append("g");

    // --- zoom & pan
    svg.call(
      d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.3, 2.5]).on("zoom", (event) => {
        g.attr("transform", event.transform);
      }) as any
    );

    const nodes = graph.nodes.map((n: any) => ({
      id: n.id,
      title: n.title,
      status: n.status || "pending",
    }));

    const links = graph.edges.map((e: any) => ({
      source: e.from,
      target: e.to,
    }));

    const simulation = d3
      .forceSimulation(nodes as any)
      .force("link", d3.forceLink(links as any).id((d: any) => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-480))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(52));

    // --- links
    const link = g
      .append("g")
      .attr("stroke", "rgba(148,163,184,0.25)")
      .attr("stroke-width", 2)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("marker-end", "url(#arrow)");

    // --- nodes
    const node = g
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(
        d3.drag<any, any>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
          })
      );

    node
      .append("circle")
      .attr("r", 36)
      .attr("fill", (d) => colorForStatus(d.status))
      .attr("stroke", "#020617")
      .attr("stroke-width", 2)
      .attr("filter", (d) => (d.status === "running" ? "url(#glow)" : null));

    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("font-size", 11)
      .attr("fill", "#e5e7eb")
      .text((d) => d.title.slice(0, 22));

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => (d.source as any).x)
        .attr("y1", (d: any) => (d.source as any).y)
        .attr("x2", (d: any) => (d.target as any).x)
        .attr("y2", (d: any) => (d.target as any).y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function colorForStatus(status: string) {
      switch (status) {
        case "running":
          return "#f59e0b";
        case "success":
          return "#10b981";
        case "failed":
          return "#ef4444";
        default:
          return "#3b82f6";
      }
    }

    return () => {
      simulation.stop();
      svg.remove();
    };
  }, [graph]);

  return (
    <div className="w-full h-[520px] rounded-md border border-slate-800 bg-gradient-to-b from-[#020617] to-[#020617]">
      <div ref={ref} className="w-full h-full" />
    </div>
  );
}

