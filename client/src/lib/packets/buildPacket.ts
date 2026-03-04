import { PacketSection, PacketState, RenderBlock } from "./packetSchemas";

export function buildPacket(sections: PacketSection[], state: PacketState): RenderBlock[] {
  let blocks: RenderBlock[] = [];

  // Generate TOC automatically from sections that will be included
  const includedSections = sections.filter(s => s.includeIf(state));
  const tocItems = includedSections.map(s => ({ title: s.title }));
  
  // Insert the dynamic TOC block before rendering the rest
  blocks.push({ type: "HEADING", level: 1, text: "TABLE OF CONTENTS" });
  blocks.push({ type: "TOC", tocItems });
  blocks.push({ type: "PAGE_BREAK" });

  includedSections.forEach((section) => {
    try {
      const sectionBlocks = section.build(state);
      blocks = blocks.concat(sectionBlocks);
    } catch (e) {
      console.error(`Failed to build section ${section.id}:`, e);
      blocks.push({ type: "HEADING", level: 1, text: section.title });
      blocks.push({ type: "PARAGRAPH", text: "Error generating section data." });
      blocks.push({ type: "PAGE_BREAK" });
    }
  });

  return blocks;
}
