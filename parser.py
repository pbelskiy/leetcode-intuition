import requests
import json
import time
import os
import re

os.makedirs("static/questions", exist_ok=True)

def get_existing_indices():
    files = os.listdir("static/questions")
    indices = [
        int(re.match(r"(\d+)\.json", f).group(1))
        for f in files
        if re.match(r"\d+\.json", f)
    ]
    return set(indices)


def fetch_question_detail(title_slug):
    query = """
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        content
        difficulty
        topicTags {
          name
          slug
        }
      }
    }
    """
    variables = {"titleSlug": title_slug}
    response = requests.post(
        "https://leetcode.com/graphql",
        headers={
            "Content-Type": "application/json",
            "Referer": "https://leetcode.com/problems/"
        },
        json={"query": query, "variables": variables}
    )
    data = response.json()
    if "errors" in data:
        print(f"❌ Error in {title_slug}: {data['errors']}")
        return None
    return data["data"]["question"]


url = "https://leetcode.com/graphql"
headers = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com/problemset/all/"
}

query = """
query questionList($categorySlug: String, $skip: Int, $limit: Int, $filters: QuestionFilterInput) {
  problemsetQuestionListV2(categorySlug: $categorySlug, skip: $skip, limit: $limit, filters: $filters) {
    questions {
      title
      titleSlug
      difficulty
      paidOnly
      topicTags {
        name
        slug
      }
    }
  }
}
"""

existing = get_existing_indices()
next_index = max(existing) + 1 if existing else 1
all_questions = []

for skip in range(0, 3700, 100):
    variables = {
        "categorySlug": "",
        "skip": skip,
        "limit": 100,
        "filters": None
    }

    response = requests.post(url, headers=headers, json={
        "query": query,
        "variables": variables
    })

    data = response.json()

    if "errors" in data:
        print("Error:", data["errors"])
        break

    batch = data["data"]["problemsetQuestionListV2"]["questions"]
    if not batch:
        break

    for q in batch:
        if q["paidOnly"]:
            continue
        if next_index in existing:
            next_index += 1
            continue
        detail = fetch_question_detail(q["titleSlug"])
        if not detail:
            continue
        filename = f"static/questions/{next_index:04}.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(detail, f, indent=2, ensure_ascii=False)
        print(f"✅ Done: {filename}")
        next_index += 1
        time.sleep(0.3)

    all_questions.extend(batch)
    print(f"📦 Total downloaded: {next_index - 1}")
    time.sleep(0.4)

with open("leetcode_questions_meta.json", "w", encoding="utf-8") as f:
    json.dump(all_questions, f, indent=2, ensure_ascii=False)

print("🎉 Well done!")
