window.BENCHMARK_DATA = {
  "lastUpdate": 1742401545783,
  "repoUrl": "https://github.com/loks0n/rapid-draughts",
  "entries": {
    "Performance Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "22452787+loks0n@users.noreply.github.com",
            "name": "loks0n",
            "username": "loks0n"
          },
          "committer": {
            "email": "22452787+loks0n@users.noreply.github.com",
            "name": "loks0n",
            "username": "loks0n"
          },
          "distinct": true,
          "id": "edeecbdd5b517086b064f47b3de0b8f03efaa68c",
          "message": "Add GitHub Actions workflow for benchmarking",
          "timestamp": "2025-03-19T16:16:37Z",
          "tree_id": "a66ec0a72b04a8361d7a40a14c6b371aaa0c8062",
          "url": "https://github.com/loks0n/rapid-draughts/commit/edeecbdd5b517086b064f47b3de0b8f03efaa68c"
        },
        "date": 1742401436355,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Move Generation",
            "value": 0.032259999999951106,
            "unit": "ms",
            "range": 0.495775999999978
          },
          {
            "name": "Random Computer (100 moves)",
            "value": 1.44700499999999,
            "unit": "ms",
            "range": 9.425879000000123
          },
          {
            "name": "Alpha-Beta (depth 3)",
            "value": 1.707100999999966,
            "unit": "ms",
            "range": 6.2571170000001075
          },
          {
            "name": "Alpha-Beta (depth 5)",
            "value": 12.487161999999898,
            "unit": "ms",
            "range": 0.4499909999999545
          },
          {
            "name": "Alpha-Beta (depth 7)",
            "value": 136.26487399999996,
            "unit": "ms",
            "range": 2.0761819999997897
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "22452787+loks0n@users.noreply.github.com",
            "name": "loks0n",
            "username": "loks0n"
          },
          "committer": {
            "email": "22452787+loks0n@users.noreply.github.com",
            "name": "loks0n",
            "username": "loks0n"
          },
          "distinct": true,
          "id": "9e90d745288c1f5aea8a552c261740abfacefb91",
          "message": "chore: bump packages",
          "timestamp": "2025-03-19T16:25:13Z",
          "tree_id": "75fd9a0096c93e3ada92b178a6b1d258ba002a5c",
          "url": "https://github.com/loks0n/rapid-draughts/commit/9e90d745288c1f5aea8a552c261740abfacefb91"
        },
        "date": 1742401545451,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "Move Generation",
            "value": 0.04992299999980787,
            "unit": "ms",
            "range": 0.6092609999998331
          },
          {
            "name": "Random Computer (100 moves)",
            "value": 1.3031470000000809,
            "unit": "ms",
            "range": 6.201340000000073
          },
          {
            "name": "Alpha-Beta (depth 3)",
            "value": 3.1357049999999163,
            "unit": "ms",
            "range": 6.677161999999953
          },
          {
            "name": "Alpha-Beta (depth 5)",
            "value": 12.92492900000002,
            "unit": "ms",
            "range": 0.5038640000000214
          },
          {
            "name": "Alpha-Beta (depth 7)",
            "value": 141.70403799999985,
            "unit": "ms",
            "range": 4.40721799999983
          }
        ]
      }
    ]
  }
}