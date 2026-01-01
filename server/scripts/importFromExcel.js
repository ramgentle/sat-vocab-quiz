const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

/**
 * Import words from Excel file
 *
 * Excel format expected:
 * Column A: word
 * Column B: definition
 * Column C: partOfSpeech (noun, verb, adjective, adverb, etc.)
 * Column D: sentences (optional - separate multiple sentences with |)
 *
 * Example:
 * | word      | definition                    | partOfSpeech | sentences                                    |
 * |-----------|-------------------------------|--------------|----------------------------------------------|
 * | abase     | to lower in rank or esteem    | verb         | He refused to abase himself. | She was abased. |
 */

function importFromExcel(excelPath) {
  // Read the Excel file
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert to JSON
  const rawData = XLSX.utils.sheet_to_json(worksheet);

  console.log(`Found ${rawData.length} rows in Excel file`);

  // Transform to our format
  const words = rawData.map((row, index) => {
    const word = row.word || row.Word || row.WORD || '';
    const definition = row.definition || row.Definition || row.DEFINITION || row.Meaning || row.meaning || '';
    const partOfSpeech = row.partOfSpeech || row.PartOfSpeech || row['Part of Speech'] || row['Word Type'] || row.pos || 'noun';
    const sentencesRaw = row.sentences || row.Sentences || row.SENTENCES || row.example || row.Example || row['Example Sentence'] || '';
    const complexityRaw = row.complexity || row.Complexity || row['Complexity Level'] || row.difficulty || row.Difficulty || row.level || row.Level || '';

    // Parse sentences (split by | or ; if multiple)
    let sentences = [];
    if (sentencesRaw) {
      sentences = sentencesRaw.split(/[|;]/).map(s => s.trim()).filter(s => s);
    }

    // Normalize complexity level
    let complexity = 'medium';
    if (complexityRaw) {
      const c = complexityRaw.toString().toLowerCase().trim();
      if (c.includes('simple') || c.includes('easy') || c.includes('low') || c === '1') {
        complexity = 'simple';
      } else if (c.includes('medium') || c.includes('moderate') || c === '2') {
        complexity = 'medium';
      } else if (c.includes('high') || c.includes('hard') || c.includes('difficult') || c.includes('complex') || c === '3') {
        complexity = 'high';
      }
    }

    // Get starting letter
    const startingLetter = word.charAt(0).toUpperCase();

    return {
      word: word.toLowerCase().trim(),
      definition: definition.trim(),
      partOfSpeech: partOfSpeech.toLowerCase().trim(),
      sentences: sentences.length > 0 ? sentences : [`The word "${word}" means ${definition}`],
      startingLetter,
      complexity
    };
  }).filter(w => w.word && w.definition); // Filter out empty rows

  console.log(`Processed ${words.length} valid words`);

  // Split into chunks of ~300 words each
  const chunkSize = 300;
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize));
  }

  // Write to JSON files
  const dataDir = path.join(__dirname, '..', 'data');

  // First, backup existing files
  const existingFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('satWords_'));
  existingFiles.forEach(file => {
    const backupName = file.replace('.json', '_backup.json');
    fs.renameSync(path.join(dataDir, file), path.join(dataDir, backupName));
    console.log(`Backed up ${file} to ${backupName}`);
  });

  // Write new files
  chunks.forEach((chunk, index) => {
    const filename = `satWords_part${index + 1}.json`;
    const filepath = path.join(dataDir, filename);
    fs.writeFileSync(filepath, JSON.stringify({ words: chunk }, null, 2));
    console.log(`Wrote ${chunk.length} words to ${filename}`);
  });

  console.log(`\nDone! Imported ${words.length} words into ${chunks.length} file(s)`);
  console.log('\nWord count by letter:');

  const letterCounts = {};
  words.forEach(w => {
    letterCounts[w.startingLetter] = (letterCounts[w.startingLetter] || 0) + 1;
  });
  Object.keys(letterCounts).sort().forEach(letter => {
    console.log(`  ${letter}: ${letterCounts[letter]}`);
  });

  return words;
}

// Get Excel file path from command line argument
const excelPath = process.argv[2];

if (!excelPath) {
  console.log('Usage: node importFromExcel.js <path-to-excel-file>');
  console.log('');
  console.log('Excel format:');
  console.log('  Column A (word): The vocabulary word');
  console.log('  Column B (definition): The definition');
  console.log('  Column C (partOfSpeech): noun, verb, adjective, etc.');
  console.log('  Column D (sentences): Example sentences (optional, separate with |)');
  console.log('');
  console.log('Example:');
  console.log('  node importFromExcel.js ./my_words.xlsx');
  process.exit(1);
}

if (!fs.existsSync(excelPath)) {
  console.error(`Error: File not found: ${excelPath}`);
  process.exit(1);
}

importFromExcel(excelPath);
