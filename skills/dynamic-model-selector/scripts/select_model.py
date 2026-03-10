
import json
import os
from os import path
from datetime import datetime
from openclaw import default_api

def analyze_task_complexity(task_description):
    """
    Analyzes task complexity based on keywords.
    """
    if 'image' in task_description or 'complex' in task_description or 'reasoning' in task_description:
        return 'complex'
    if 'audit' in task_description or 'review' in task_description or 'optimize' in task_description:
        return 'moderate'
    return 'simple'

def select_and_set_model(task_description):
    """
    Selects and sets the optimal model based on task complexity and session status.
    """
    print(f"Analyzing task: "{task_description}" for dynamic model selection...")
    chosen_model = 'google/gemini-2.5-flash-preview'  # Default low-cost model
    complexity = analyze_task_complexity(task_description)

    # 1. Get current session status and model info using the direct tool call
    session_status_result = default_api.session_status()
    session_status_output = session_status_result.get('session_status_response', {}).get('output', '')

    current_model = None
    fallback_model = None
    current_tokens_in = 0
    current_context = 0

    for line in session_status_output.splitlines():
        if '🧠 Model:' in line:
            current_model = line.split('🧠 Model: ')[1].split(' ')[0]
        elif '↪️ Fallback:' in line:
            fallback_model = line.split('↪️ Fallback: ')[1].split(' ')[0]
        elif '🧮 Tokens:' in line and 'in' in line:
            try:
                current_tokens_in = int(float(line.split('🧮 Tokens: ')[1].split('k in')[0]) * 1000)
            except ValueError:
                pass
        elif '📚 Context:' in line:
            try:
                current_context = int(float(line.split('📚 Context: ')[1].split('k')[0]) * 1000)
            except ValueError:
                pass

    # Simplified logic: If complex task, try for Pro if not currently Pro and resources *might* allow.
    if complexity == 'complex' and current_model and 'pro' not in current_model:
        if current_context < 500000:  # Arbitrary threshold
            chosen_model = 'google/gemini-3-pro-preview'
            print(f"Task identified as complex. Attempting to switch to {chosen_model}.")
        else:
            print(f"Task identified as complex, but context too large for Pro. Sticking to {chosen_model}.")
    else:
        print(f"Task identified as {complexity}. Keeping efficient model: {chosen_model}.")

    # 2. Set the model for the current session
    set_model_result = default_api.session_status(model=chosen_model)
    if set_model_result.get('status') == 'error':
        print(f"Failed to set model to {chosen_model}: {set_model_result.get('output', 'Unknown error')}")
        if fallback_model:
            print(f"Attempting fallback to {fallback_model} due to error.")
            default_api.session_status(model=fallback_model)
    else:
        print(f"Model successfully set to: {chosen_model}")
        # Log to memory for traceability
        log_entry = f"| {datetime.now().isoformat().split('T')[0]} | Model Change | Selected: {chosen_model} | Reason: Task complexity ({complexity}), current context: {current_context} tokens. |
"
        log_path = path.join(path.dirname(__file__), '../../../../memory', f"{datetime.now().isoformat().split('T')[0]}.md")
        os.makedirs(path.dirname(log_path), exist_ok=True)
        with open(log_path, 'a') as f:
            f.write(log_entry)
    return chosen_model

# Entry point for the script
if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        task_description_arg = sys.argv[1]
        select_and_set_model(task_description_arg)
    else:
        print("Error: Missing task description argument for dynamic-model-selector.")
        sys.exit(1)
