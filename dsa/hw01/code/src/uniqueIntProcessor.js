const fs = require('fs');
const path = require('path');

class IntegerFilter {
    constructor() {
        this.seenIntegers = new Set();
        this.MIN = -1023;
        this.MAX = 1023;
    }

    processInputFile(input, output) {
        console.log(`Processing file: ${input}`);
        this.seenIntegers.clear();
        try {
            const { uniqueInts } = this.extractUniqueIntegers(input);
            console.log(`Unique integers found: ${uniqueInts.length}`);
            console.log(`Unique integers: ${uniqueInts.join(', ')}`);
            this.saveToFile(uniqueInts, output);
        } catch (error) {
            console.error(`Error processing file ${input}: ${error.message}`);
        }
    }

    extractUniqueIntegers(filePath) {
        console.log(`Reading file: ${filePath}`);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`Raw file contents: "${content}"`);
        if (content.trim() === '') {
            console.warn(`Warning: File is empty: ${filePath}`);
            return { uniqueInts: [] };
        }
        
        const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
        console.log(`Number of lines: ${lines.length}`);

        const uniqueInts = new Set();

        lines.forEach(line => {

            const tupleMatch = line.match(/\(([^)]+)\)/);
            if (tupleMatch) {
                const tupleParts = tupleMatch[1].split(',').map(str => str.trim());
                if (tupleParts.length === 3) {
                    const num = parseInt(tupleParts[2], 10); 
                    if (this.isInRange(num)) {
                        uniqueInts.add(num);
                    }
                }
            } else {
               
                const num = parseFloat(line); 
                if (this.isInRange(num)) {
                    uniqueInts.add(num);
                }
            }
        });

        const sortedUniqueInts = Array.from(uniqueInts).sort((a, b) => a - b);

        return { uniqueInts: sortedUniqueInts };
    }

    isInRange(num) {
        const inRange = !isNaN(num) && num >= this.MIN && num <= this.MAX;
        if (inRange) {
            this.seenIntegers.add(num);
        }
        return inRange;
    }

    saveToFile(numbers, filePath) {
        console.log(`Saving to file: ${filePath}`);
        let content = numbers.join('\n');
        console.log(`Content to be saved:\n"${content}"`);
        fs.writeFileSync(filePath, content);
        console.log(`File saved with ${numbers.length} numbers`);
    }
}


const inputDir = '../../sample_inputs';   
const outputDir = '../../sample_results'; 

console.log(`Input directory: ${inputDir}`);
console.log(`Output directory: ${outputDir}`);


if (!fs.existsSync(inputDir)) {
    console.error(`Error: Input directory does not exist: ${inputDir}`);
    process.exit(1);
}


if (!fs.existsSync(outputDir)) {
    console.log(`Output directory does not exist. Creating: ${outputDir}`);
    fs.mkdirSync(outputDir, { recursive: true });
}

const processor = new IntegerFilter();

const inputFiles = fs.readdirSync(inputDir).filter(file => file.endsWith('.txt'));
console.log(`Input files found: ${inputFiles.join(', ')}`);

if (inputFiles.length === 0) {
    console.warn(`Warning: No .txt files found in ${inputDir}`);
} else {
    inputFiles.forEach(file => {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, `${file}_result.txt`);
        
        console.log(`Processing ${file}`);
        processor.processInputFile(inputPath, outputPath);
        console.log(`Finished processing ${file}`);
    });
}
