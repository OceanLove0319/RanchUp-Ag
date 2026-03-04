import { PacketSection, PacketState, RenderBlock } from "./packetSchemas";

export function buildPacket(sections: PacketSection[], state: PacketState): RenderBlock[] {
  const blocks: RenderBlock[] = [];

  // Pass 1: Build sections
  const sectionsToInclude = sections.filter(s => s.includeIf(state));
  
  // Create TOC blocks
  const tocBlocks: RenderBlock[] = [
    { type: "HEADING", level: 1, text: "TABLE OF CONTENTS" },
    { type: "TOC", tocItems: sectionsToInclude.map(s => ({ title: s.title })) },
    { type: "PAGE_BREAK" }
  ];

  // For the Season packet, we inject the TOC after the cover page (if cover is first)
  if (sectionsToInclude.length > 0 && sectionsToInclude[0].id === "cover") {
    // Add Cover
    blocks.push(...sectionsToInclude[0].build(state));
    // Add TOC
    blocks.push(...tocBlocks);
    // Add rest
    sectionsToInclude.slice(1).forEach(section => {
      blocks.push(...section.build(state));
    });
  } else {
    blocks.push(...tocBlocks);
    sectionsToInclude.forEach(section => {
      blocks.push(...section.build(state));
    });
  }

  return blocks;
}
