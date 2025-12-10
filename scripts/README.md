# Ecosystem Update Scripts

This directory contains scripts to help manage and update the Boba Network ecosystem list.

## `update_ecosystem.py`

This Python script automates the process of updating `ecosystem/list.json` based on a CSV input file (usually provided by the business team) and available icons in `ecosystem/icons`.

### Features
- **CSV Parsing**: Reads partner data from `docs/new_partner.csv`.
- **Icon Auto-Discovery**: Automatically finds matching icons (SVG preferred, then WebP/PNG) in `ecosystem/icons/light` and `ecosystem/icons/dark`. It handles various naming conventions (exact match, snake_case, lowercase).
- **Smart Updates**: 
  - Updates existing entries if found (names match).
  - adds new entries if they are new.
  - Skips entries if no icons are found (prevents broken UI).
- **Normalization**: Cleans up names and descriptions (removes internal notes like "(new description)").

### Prerequisites
- Python 3.x installed.
- `docs/new_partner.csv` must exist and follow the format: `name,Description,Link,Category`.
- Icons should be placed in `ecosystem/icons/light` and `ecosystem/icons/dark`.

### Usage

1. **Prepare Data**:
   - Ensure the CSV file is at `docs/new_partner.csv`.
   - Ensure new icons are added to the icons directories.

2. **Run the Script**:
   From the root of the repository:
   ```bash
   python3 scripts/update_ecosystem.py
   ```

3. **Verify**:
   - Check `ecosystem/list.json` for changes.
   - Run a git diff to verify the updates.

### structure
- `scripts/update_ecosystem.py`: The main script.
- `ecosystem/list.json`: The target JSON database.
- `ecosystem/icons/`: Directory for icon assets.

---
**Note**: The script prioritizes `.svg` files over `.webp` or `.png`. If you have an SVG available, it will be chosen even if a WebP exists with a slightly better matching name.
