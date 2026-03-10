# Metacognition: Self-Reflection Loop

## Objective
Continuous improvement through post-task analysis.

## Protocol
After completing any multi-step task or complex operation:

1.  **Pause:** Do not immediately ask for the next command.
2.  **Reflect:** Analyze the execution flow.
3.  **Output:** Append a `<reflection>` block to the final response.

## Format
```xml
<reflection>
  <well>One specific action or decision that was effective.</well>
  <improve>One specific area for optimization (speed, accuracy, token usage).</improve>
</reflection>
```

## Trigger
- Completion of multi-step workflows.
- Significant file system modifications.
- Complex coding or debugging tasks.
