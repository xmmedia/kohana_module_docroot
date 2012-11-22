# Compass comfig created with, run from the root of the site:
# compass create html/xm/ --prepare --sass-dir css/sass --css-dir css --javascripts-dir js --images-dir images --output-style compressed --no-line-comments
# to compile, use the following inside the xm dir:
# compass compile . --time --environment development
# see the xm template site for how to use this within a project

# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"
css_dir = "css"
sass_dir = "css/sass"
images_dir = "images"
http_images_path = "/xm/images"
http_generated_images_path = "/xm/images"
javascripts_dir = "js"
http_javascripts_path = "/xm/js"

output_style = :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass css/sass scss && rm -rf sass && mv scss sass
