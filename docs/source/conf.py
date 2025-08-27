# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html
import os
import sys

sys.path.insert(0, os.path.abspath("../.."))

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "i2b2-jp"
copyright = "2025–present, University of Tokyo Hospital, Department of Healthcare Information Management"
author = "University of Tokyo Hospital, Department of Healthcare Information Management, and i2b2 Japanese collaboration members"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.napoleon",
    "sphinx.ext.viewcode",
    "myst_parser",
]

templates_path = ["_templates"]
exclude_patterns = []


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "sphinx_rtd_theme"
html_static_path = ["_static"]

# -- Extended by the author --
html_show_sourcelink = False
autodoc_default_options = {}
html_css_files = [
    "custom_css.css",
]
html_js_files = []

# -- Hide or show the Sphinx link in the HTML output --
html_show_sphinx = False

# -- Custom logo and theme options ------------------------------------------
html_logo = "_static/images/logos/logo.svg"
html_favicon = "_static/images/logos/favicon.svg"
html_theme_options = {
    "logo_only": True,  # Only show the logo (no title text)
    "display_version": False,  # Optional: hides the version string
}
# disable auto-linking of scaled images
html_scaled_image_link = False

