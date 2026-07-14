DESTINATION_DIR="lib"

FILENAMES="readme.md license"

for filename in $FILENAMES; do
    src_file=$(find . -maxdepth 1 -iname "$filename" | head -n 1)

    if [ -n "$src_file" ]; then
        cp "$src_file" "$DESTINATION_DIR/$filename"
        echo "✅ '$DESTINATION_DIR/$filename' updated!"
    else
        echo "❌ Source file for '$filename' not found!"
    fi
done
