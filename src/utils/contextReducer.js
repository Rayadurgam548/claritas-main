/**
 * Compress the heavy JSON analysis output into a lightweight markdown string.
 * This ensures we don't send the entire raw 50-page document to the agents
 * every single time they chat, saving thousands of tokens.
 */

const reduceContext = (analysisResult, documentText) => {
  if (!analysisResult) {
    // Fallback if no analysis exists
    return `--- FULL RAW TEXT (Fallback) ---\n${documentText ? documentText.substring(0, 3000) : 'No context available'}`;
  }

  let compressed = `--- COMPRESSED DOCUMENT CONTEXT ---\n\n`;
  compressed += `**DOCUMENT SUMMARY**\n${analysisResult.summary || 'N/A'}\n\n`;
  compressed += `**OVERALL RISK STATUS:** ${analysisResult.riskStatus || 'N/A'}\n\n`;
  
  if (analysisResult.topRisks && analysisResult.topRisks.length > 0) {
    compressed += `**TOP RISKS:**\n`;
    analysisResult.topRisks.forEach((r, i) => {
      compressed += `${i + 1}. [${r.severity}] ${r.title}: ${r.explanation}\n`;
    });
    compressed += '\n';
  }

  if (analysisResult.clauses && analysisResult.clauses.length > 0) {
    compressed += `**KEY EXTRACTED CLAUSES:**\n`;
    analysisResult.clauses.forEach((c, i) => {
      compressed += `Clause ${i + 1} Snippet: "${c.snippet}"\n`;
      compressed += `Explanation: ${c.explanation}\n\n`;
    });
  }

  if (analysisResult.simulation) {
    compressed += `**FINANCIAL/PENALTY SIMULATION:**\n`;
    compressed += `Loss: ${analysisResult.simulation.financialLoss}\n`;
    compressed += `Penalties: ${analysisResult.simulation.penalties}\n`;
    compressed += `Worst Case: ${analysisResult.simulation.worstCase}\n\n`;
  }

  return compressed;
};

module.exports = {
  reduceContext,
};
