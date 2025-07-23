# 🧠 Leetcode Topic Intuition

A lightweight quiz app to help you build intuition for identifying algorithms and topics behind Leetcode problems.

## 🚀 Features

- 📚 20 random Leetcode problems per session
- 🏷️ Multiple-choice questions based on tags/topics
- ✅ Instant feedback after each answer
- 📊 Final score summary at the end
- 📱 Mobile-friendly single-page app
- 🔌 No backend — fully static and fast
- 🗂️ Questions stored as individual `.json` files

## 🎯 Goal

To train your instinct for recognizing what kind of algorithm or technique a problem requires — dynamic programming, greedy, DFS, etc. Great for interview prep and daily practice.

## 🛠️ Tech Stack

- HTML, CSS, JS (vanilla)
- Static JSON files with problem data
- Deployed via GitHub Pages (or any static hosting)

## 🗃️ Data Format

Each question is stored as a separate `XXXX.json` file with:

```json
{
  "title": "Two Sum",
  "questionId": 1,
  "description": "...",
  "choices": ["Hash Table", "Greedy", "DFS", "Binary Search"],
  "answer": "Hash Table",
  "tags": ["Array", "Hash Table", "Two Pointers"]
}
