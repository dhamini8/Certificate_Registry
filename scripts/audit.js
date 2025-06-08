const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function getNextReportNumber() {
  const reportDir = path.join(__dirname, '..');
  const files = fs.readdirSync(reportDir);
  let maxNum = 0;
  
  files.forEach(file => {
    const match = file.match(/^report(\d+)\.json$/);
    if (match) {
      maxNum = Math.max(maxNum, parseInt(match[1]));
    }
  });
  
  return maxNum + 1;
}

async function runSlitherAnalysis() {
  try {
    console.log("Running Slither analysis...");
    
    // Get the next report number
    const reportNum = await getNextReportNumber();
    const reportFile = `report${reportNum}.json`;
    
    // Run Slither and capture the output
    const slitherOutput = execSync(
      `slither . --json ${reportFile}`,
      { encoding: 'utf-8' }
    );

    // Print analysis summary
    console.log(`\nVulnerability Analysis Complete!`);
    console.log(`Report saved to ${reportFile}`);
    
    // Read and parse the JSON report
    const reportPath = path.join(__dirname, '..', reportFile);
    const report = JSON.parse(fs.readFileSync(reportPath));
    
    // Print summary of findings
    console.log("\nSummary of findings:");
    const results = report.results.detectors;
    results.forEach((finding, index) => {
      console.log(`\n${index + 1}. ${finding.check}: ${finding.impact}`);
      console.log(`   Description: ${finding.description}`);
    });

  } catch (error) {
    console.error("Analysis failed:", error.message);
    process.exit(1);
  }
}

runSlitherAnalysis()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });