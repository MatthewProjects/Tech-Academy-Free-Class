# Documentation

## Context

### `codesandbox.workspaceState`

Enum that describes the current state of the user's workspace.

Specific workspace state allows us to enable certain extension commands (like "Go to Branch") conditionally.

| Value          | Description                                                     |
| -------------- | --------------------------------------------------------------- |
| `undefined`    | The workspace state is unknown (i.e. the user is unauthorized). |
| `"repository"` | The user is selecting a repository (project).                   |
| `"branch"`     | The user has opened a project on a branch.                      |

You can use this context value in `package.json`, for examlpe, when describing conditional commands:

```json
{
  "contributes": {
    "menus": {
      "commandPalette": [
        {
          "command": "codesandbox.goToBranch",
          "when": "codesandbox.signedIn && codesandbox.workspaceState == branch"
        }
      ]
    }
  }
}
```

This will enable the `codesandbox.goToBranch` command only if A) the user is signed in; B) the user is currently working on an opened branch.

> Please do not use this context value to determine if the user is signed in. Use the designated `codesandbox.signedIn` instead.
