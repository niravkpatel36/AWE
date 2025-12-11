import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

export default function GraphView({ graph }: { graph: any }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.innerHTML = "";

    const width = container.clientWidth || 900;
    const height = 520;

    const svg = d3.select(container).append("svg").attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "xMidYMid meet").style("width", "100%").style("height", `${height}px`);

    const defs = svg.append("defs");
    defs.append("filter").attr("id", "glow").append("feGaussianBlur").attr("stdDeviation", 6).attr("result", "coloredBlur");

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([0.25, 3]).on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
    svg.call(zoom as any);

    const nodes = (graph?.nodes || []).map((n: any) => ({ id: n.id, title: n.title, status: n.status || "pending", raw: n }));
    const links = (graph?.edges || []).map((e: any) => ({ source: e.from, target: e.to }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links as any).id((d:any) => d.id).distance(130).strength(1))
      .force("charge", d3.forceManyBody().strength(-420))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(52));

    const link = g.append("g").attr("stroke", "rgba(255,255,255,0.06)").selectAll("line").data(links).join("line").attr("stroke-width", 2);

    const node = g.append("g").selectAll("g").data(nodes).join("g").attr("cursor", "pointer").call(d3.drag()
      .on("start", (event:any, d:any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; d.fy = d.y;
      })
      .on("drag", (event:any, d:any) => { d.fx = event.x; d.fy = event.y; })
      .on("end", (event:any, d:any) => {
        if (!event.active) simulation.alphaTarget(0);
      })
    );

    node.append("circle")
      .attr("r", 36)
      .attr("fill", (d:any) => colorForStatus(d.status))
      .attr("stroke", "#071b24")
      .attr("stroke-width", 2)
      .attr("filter", (d:any) => d.status === "running" ? "url(#glow)" : null)
      .style("transition", "transform 160ms ease");

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 6)
      .attr("font-size", 11)
      .attr("fill", "#e6eef8")
      .text((d:any) => d.title?.slice(0, 22));

    // pulsing animation for running nodes
    node.filter((d:any) => d.status === "running").select("circle").attr("class", "running-node");

    simulation.on("tick", () => {
      link
        .attr("x1", (d:any) => (d.source as any).x)
        .attr("y1", (d:any) => (d.source as any).y)
        .attr("x2", (d:any) => (d.target as any).x)
        .attr("y2", (d:any) => (d.target as any).y);

      node.attr("transform", (d:any) => `translate(${d.x},${d.y})`);
    });

    // click handler: center on node + flash
    node.on("click", function (event:any, d:any) {
      const x = d.x, y = d.y;
      svg.transition().duration(600).call(zoom.transform as any, d3.zoomIdentity.translate(width / 2 - x * 1.6, height / 2 - y * 1.6).scale(1.6));
      const circ = d3.select(this).select("circle");
      circ.transition().duration(120).attr("r", 44).transition().duration(300).attr("r", 36);
    });

    function colorForStatus(s: string) {
      switch (s) {
        case "running": return "#f59e0b";
        case "success": return "#10b981";
        case "failed": return "#ef4444";
        default: return "#3b82f6";
      }
    }

    return () => {
      simulation.stop();
      svg.remove();
    };
  }, [graph]);

  return (
    <div className="w-full h-[520px]">
      <div ref={ref} className="w-full h-full rounded-md border border-slate-800 bg-gradient-to-b from-[#051018] to-[#07121a] p-1" />
      <style>{`.running-node{ animation: pulseNode 1.6s ease-in-out infinite; } @keyframes pulseNode {0%{transform:scale(1);opacity:1}50%{transform:scale(1.06);opacity:0.9}100%{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
