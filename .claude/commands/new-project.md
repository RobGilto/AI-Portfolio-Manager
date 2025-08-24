#!/bin/bash
# /new-project [name] [stage] [type] - Create new project in specified stage

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: /new-project <name> <stage> [type]"
    echo ""
    echo "Arguments:"
    echo "  name   - Project name (required)"  
    echo "  stage  - Project stage: exploration, active, dev (required)"
    echo "  type   - Project type: 1-7 or frontend, backend, fullstack, ai-python, cli, mcp, ai-langchain (optional)"
    echo ""
    echo "🎯 Project Types (with smart semantic matching):"
    echo ""
    echo "🖼️  1 | frontend     - User Interface/Website"
    echo "   → frontend, ui, website, dashboard, spa, react, webapp, interface"
    echo ""
    echo "⚙️  2 | backend      - Server/API"
    echo "   → backend, api, server, microservice, rest, database, crud"
    echo ""
    echo "🌐 3 | fullstack    - Complete Web App"
    echo "   → fullstack, webapp, platform, complete, nextjs, application"
    echo ""
    echo "🤖 4 | ai-python    - AI/Machine Learning"
    echo "   → ai, ml, data, analytics, model, python, fastapi, neural"
    echo ""
    echo "⌨️  5 | cli          - Command Line Tool"
    echo "   → cli, tool, script, automation, terminal, utility, workflow"
    echo ""
    echo "🔌 6 | mcp          - Claude Integration"
    echo "   → mcp, claude, plugin, integration, connector, extension"
    echo ""
    echo "💬 7 | ai-langchain - AI Chat/Agent"
    echo "   → langchain, chatbot, agent, rag, conversation, llm"
    echo ""
    echo "💡 Describe what you're building naturally:"
    echo "  /new-project my-dashboard dev dashboard    # → frontend"
    echo "  /new-project my-chatbot dev conversation   # → ai-langchain"
    echo "  /new-project my-service dev microservice   # → backend"
    echo "  /new-project my-helper dev utility         # → cli"
    exit 1
fi

if [ -n "$3" ]; then
    npm run new:project "$1" "$2" "$3"
else
    npm run new:project "$1" "$2"
fi