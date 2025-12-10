import csv
import json
import os
import re

# Paths
CSV_PATH = os.path.abspath("docs/new_partner.csv")
JSON_PATH = os.path.abspath("ecosystem/list.json")
ICONS_DIR = os.path.abspath("ecosystem/icons")

def clean_name(name):
    # Remove text in parentheses like " (new description)" or " (need new logo change)"
    return re.sub(r'\s*\(.*?\)\s*', '', name).strip()

def normalize_name(name):
    # Normalize for comparison (lowercase, remove spaces/punctuation)
    return re.sub(r'[^a-zA-Z0-9]', '', clean_name(name).lower())

def find_icon(name):
    # Search for icon in light and dark directories
    # Returns a dict {"light": "light/file", "dark": "dark/file"} or None
    
    cleaned_name = clean_name(name)
    normalized = normalize_name(cleaned_name)
    
    # Potential filenames to try
    # 1. exact normalized name
    # 2. snake case (replace spaces with _)
    # 3. just lowercase
    
    candidates = [
        normalized,
        cleaned_name.lower().replace(" ", "_"),
        cleaned_name.lower().replace(" ", ""),
        cleaned_name.lower()
    ]
    
    # Special cases handling if needed, but let's try generic first
    
    light_dir = os.path.join(ICONS_DIR, "light")
    dark_dir = os.path.join(ICONS_DIR, "dark")
    
    found_icons = {}
    
    for subdir, dirname in [("light", light_dir), ("dark", dark_dir)]:
        found = False
        if not os.path.exists(dirname):
            continue
            
        files = set(os.listdir(dirname))
        
        # Prioritize extensions: SVG > WebP > PNG
        extensions = [".svg", ".webp", ".png"]
        
        for ext in extensions:
            for cand in candidates:
                filename = cand + ext
                if filename in files:
                    found_icons[subdir] = f"{subdir}/{filename}"
                    found = True
                    break
            if found:
                break
        
    if "light" in found_icons and "dark" in found_icons:
        return found_icons
    
    return None

def main():
    print(f"Reading CSV from {CSV_PATH}")
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        csv_rows = list(reader)

    print(f"Reading JSON from {JSON_PATH}")
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Create a map of normalized names to index in the list for fast lookup
    existing_map = {}
    for idx, item in enumerate(data):
        norm = normalize_name(item.get("name", ""))
        existing_map[norm] = idx

    updates_count = 0
    adds_count = 0
    skips_count = 0

    for row in csv_rows:
        raw_name = row['name']
        name = clean_name(raw_name)
        norm_name = normalize_name(name)

        description = row.get('Description')
        link = row.get('Link')
        category = row.get('Category')

        # Check for icons
        icon_data = find_icon(name)
        
        if norm_name in existing_map:
            # Update existing
            idx = existing_map[norm_name]
            entry = data[idx]
            print(f"Updating existing entry: {entry['name']}")
            
            if description and description.lower() != "unchanged":
                entry['description'] = description
            if link and link.lower() != "unchanged":
                entry['link'] = link
                # Update website too if link changed? usually website is just the domain
                if "://" in link:
                     entry['website'] = link.split("://")[1].split("/")[0]
            if category and category.lower() != "unchanged":
                entry['type'] = category
            
            # Update icons if found (better new icons?)
            if icon_data:
                 entry['icon'] = icon_data
            
            updates_count += 1
        else:
            # New entry
            if icon_data:
                print(f"Adding new entry: {name}")
                new_entry = {
                    "icon": icon_data,
                    "name": name,
                    "website": "", # Derived from link
                    "link": link,
                    "description": description,
                    "type": category,
                    "visible": True
                }
                if link and "://" in link:
                    new_entry['website'] = link.split("://")[1].split("/")[0]
                
                data.append(new_entry)
                adds_count += 1
            else:
                print(f"Skipping {name} - Icons not found")
                skips_count += 1

    print(f"Updates: {updates_count}, Adds: {adds_count}, Skips: {skips_count}")

    # Write back
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2) # Keep indentation
    
    print("Done.")

if __name__ == "__main__":
    main()
