import json
from pathlib import Path

questions_dir = Path("questions")
output_file = Path("static/topics.json")

unique_slugs = set()

for file in sorted(questions_dir.glob("*.json")):
    try:
        with open(file, "r", encoding="utf-8") as f:
            data = json.load(f)
            topic_tags = data.get("topicTags", [])
            for tag in topic_tags:
                slug = tag.get("slug")
                if slug:
                    unique_slugs.add(slug)
    except Exception as e:
        print(f"⚠️ Error {file.name}: {e}")


slug_list = sorted(unique_slugs)

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(slug_list, f, indent=2, ensure_ascii=False)

print(f"✅ Saved to {output_file}")
