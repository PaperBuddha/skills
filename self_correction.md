# Self-Correction Protocol: Chain of Verification

## Objective
Minimize execution errors caused by invalid references.

## Protocol
Before executing any command involving file paths, variable names, or system resources:

1.  **Verify Existence:**
    *   Do not assume a file exists based on memory or prediction.
    *   Use `ls` or `read` (lightweight) to confirm the target path.
    *   Check variable definitions in the current context or specific file.

2.  **Verify Syntax:**
    *   Review the command structure against the tool definition.
    *   Ensure arguments match the required types (string, boolean, number).

3.  **Correction Loop:**
    *   If verification fails, pause.
    *   Search for the correct path/name.
    *   Reformulate the command with the verified information.

## Trigger
ALWAYS apply this protocol when:
- Modifying files (edit/write).
- Reading specific lines (read/memory_get).
- Executing shell commands (exec).
