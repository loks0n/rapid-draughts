import { performance } from 'node:perf_hooks';
import { DraughtsStatus } from '../src/core';
import {
  EnglishDraughts as Draughts,
  EnglishDraughtsComputerFactory as ComputerFactory,
} from '../src/english';

// Benchmark configuration
const ITERATIONS = 20;
const WARMUP_ITERATIONS = 3;

// Functions to benchmark
const benchmarks = {
  'Move Generation': () => {
    return () => {
      // Create a fresh instance for each test
      const draughts = Draughts.setup();

      // Generate and count all available moves
      const moves = draughts.moves;
      return moves.length;
    };
  },
  'Random Computer (100 moves)': () => {
    const computer = ComputerFactory.random();

    return async () => {
      // Create a fresh game for each test
      const testDraughts = Draughts.setup();
      let moveCount = 0;

      // Play 100 moves or until game is over
      while (testDraughts.status === DraughtsStatus.PLAYING && moveCount < 100) {
        const move = await computer(testDraughts);
        if (move) {
          testDraughts.move(move);
          moveCount++;
        } else {
          break;
        }
      }

      return moveCount;
    };
  },
  'Alpha-Beta (depth 3)': () => {
    const computer = ComputerFactory.alphaBeta({
      maxDepth: 3,
      quiescence: false
    });

    return async () => {
      // Create a fresh game for each test
      const testDraughts = Draughts.setup();
      const move = await computer(testDraughts);
      return move ? 1 : 0;
    };
  },
  'Alpha-Beta (depth 5)': () => {
    const computer = ComputerFactory.alphaBeta({
      maxDepth: 5,
      quiescence: false
    });

    return async () => {
      // Create a fresh game for each test
      const testDraughts = Draughts.setup();
      const move = await computer(testDraughts);
      return move ? 1 : 0;
    };
  },
  'Alpha-Beta (depth 7)': () => {
    const computer = ComputerFactory.alphaBeta({
      maxDepth: 7,
      quiescence: false
    });

    return async () => {
      // Create a fresh game for each test
      const testDraughts = Draughts.setup();
      const move = await computer(testDraughts);
      return move ? 1 : 0;
    };
  }
};

// Run a single benchmark
async function runBenchmark(name: string, setupFn: () => () => Promise<number> | number) {
  console.log(`\nRunning benchmark: ${name}`);

  const fn = setupFn();

  // Warm up
  console.log('  Warming up...');
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    await fn();
  }

  // Actual benchmark
  const results: number[] = [];

  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    results.push(duration);
    console.log(`  Run ${i + 1}: ${duration.toFixed(2)}ms (result: ${result})`);
  }

  // Calculate statistics
  results.sort((a, b) => a - b);
  const min = results[0];
  const max = results[results.length - 1];
  const median = results[Math.floor(results.length / 2)];
  const average = results.reduce((sum, time) => sum + time, 0) / results.length;

  console.log('\n  Statistics:');
  console.log(`    Min: ${min.toFixed(2)}ms`);
  console.log(`    Max: ${max.toFixed(2)}ms`);
  console.log(`    Average: ${average.toFixed(2)}ms`);
  console.log(`    Median: ${median.toFixed(2)}ms`);

  return {
    name,
    min,
    max,
    average,
    median,
    runs: results
  };
}

// Run all benchmarks
async function runAllBenchmarks() {
  console.log('Starting benchmarks...');
  console.log(`Iterations: ${ITERATIONS} (with ${WARMUP_ITERATIONS} warmup iterations)`);

  const results = [];
  const benchmarkResults = [];

  for (const [name, setupFn] of Object.entries(benchmarks)) {
    const result = await runBenchmark(name, setupFn as any);
    results.push(result);

    // Add to benchmark results for GitHub Action
    benchmarkResults.push({
      name: result.name,
      value: result.median, // We'll use median as our primary metric
      unit: 'ms',
      range: result.max - result.min,
    });
  }

  // Summary
  console.log('\n=== BENCHMARK SUMMARY ===');
  console.table(results.map(r => ({
    Name: r.name,
    'Min (ms)': r.min.toFixed(2),
    'Max (ms)': r.max.toFixed(2),
    'Avg (ms)': r.average.toFixed(2),
    'Median (ms)': r.median.toFixed(2)
  })));

  // Write benchmark results to file for GitHub Action
  if (process.env.CI) {
    const fs = await import('node:fs/promises');
    await fs.mkdir('./.github', { recursive: true });
    await fs.writeFile(
      './.github/benchmark-results.json',
      JSON.stringify(benchmarkResults, null, 2)
    );
    console.log('Benchmark results saved to ./.github/benchmark-results.json');
  }

  return results;
}

// Run benchmarks
runAllBenchmarks().catch(console.error);
