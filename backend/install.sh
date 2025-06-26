#!/bin/bash

uv venv .venv
source .venv/bin/activate
uv pip install -r requirements.txt
uv pip install httpx==0.24.1
