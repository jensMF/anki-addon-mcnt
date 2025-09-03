import json
import os
import zipfile

# --- Configuration ---
# The script assumes it is located in a 'tools' directory at the project root.
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE_SUBDIR = 'src'
VERSIONS_DIR = 'versions'
# ---------------------

def get_addon_info(addon_src_dir):
    """Reads manifest.json to get package name and version."""
    manifest_path = os.path.join(addon_src_dir, 'manifest.json')
    if not os.path.exists(manifest_path):
        raise FileNotFoundError(f"manifest.json not found in {addon_src_dir}")

    with open(manifest_path, 'r') as f:
        manifest = json.load(f)

    package = manifest.get('package')
    version = manifest.get('version')

    if not package or not version:
        raise ValueError("'package' and/or 'version' not found in manifest.json")

    return package, version

def create_anki_addon(addon_src_dir, package_name, version, output_dir):
    """Creates a .ankiaddon zip file from the source directory."""

    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Define the output file name
    if '-dev' in version:
        base_version = version.split('-dev')[0]
        numeric_version = base_version.lstrip('vV')
        output_filename = f"{package_name}-dev-V{numeric_version}.ankiaddon"
    else:
        numeric_version = version.lstrip('vV')
        output_filename = f"{package_name}-V{numeric_version}.ankiaddon"
    output_filepath = os.path.join(output_dir, output_filename)

    print(f"Creating add-on package: {output_filepath}")

    with zipfile.ZipFile(output_filepath, 'w', zipfile.ZIP_DEFLATED) as zf:
        # Walk through the source directory
        for root, dirs, files in os.walk(addon_src_dir):
            # Exclude __pycache__ directories from being traversed
            if '__pycache__' in dirs:
                dirs.remove('__pycache__')

            for file in files:
                # Get the full path of the file
                file_path = os.path.join(root, file)

                # Determine the name of the file inside the zip archive.
                # It should be relative to the addon source directory.
                arcname = os.path.relpath(file_path, addon_src_dir)

                # Add file to the zip
                zf.write(file_path, arcname)
                print(f"  Adding: {arcname}")

    print(f"\nSuccessfully created {output_filename} in {output_dir}")

def main():
    """Main function to drive the build process."""
    try:
        # We need to find the actual source folder for the add-on.
        # Based on the structure, it is 'mcnt' inside 'src'.
        src_dir_base = os.path.join(PROJECT_ROOT, SOURCE_SUBDIR)

        # Find the first subdirectory in 'src' which is assumed to be the addon source
        try:
            addon_folder_name = next(d for d in os.listdir(src_dir_base) if os.path.isdir(os.path.join(src_dir_base, d)))
        except StopIteration:
            print(f"Error: No subdirectories found in '{src_dir_base}'. Cannot determine add-on source.")
            return

        addon_src_path = os.path.join(src_dir_base, addon_folder_name)
        output_path = os.path.join(PROJECT_ROOT, VERSIONS_DIR)

        print(f"Project root: {PROJECT_ROOT}")
        print(f"Add-on source directory: {addon_src_path}")
        print(f"Output directory: {output_path}")

        # Get package name and version from manifest
        package, version = get_addon_info(addon_src_path)
        print(f"Package Name: {package}, Version: {version}\n")

        # Create the .ankiaddon file
        create_anki_addon(addon_src_path, package, version, output_path)

    except (FileNotFoundError, ValueError) as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
