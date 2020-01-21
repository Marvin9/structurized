[![Build Status](https://travis-ci.com/Marvin9/structurized.svg?branch=master)](https://travis-ci.com/Marvin9/structurized)
[![DeepScan grade](https://deepscan.io/api/teams/6570/projects/8580/branches/105870/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=6570&pid=8580&bid=105870)
[![codecov](https://codecov.io/gh/Marvin9/structurized/branch/master/graph/badge.svg)](https://codecov.io/gh/Marvin9/structurized)

# structurized

Follow defined structure of project.

```
npm i structurized --save-dev -g
```

## Example

![structure](https://github.com/Marvin9/structurized/blob/master/example/structure.png)

![output](https://github.com/Marvin9/structurized/blob/master/example/output.png)

## 1. Define structure at root of project

  - create **structure.yml** file at root path of project.
  - write rules of structure in human readable form.

**structure.yml**

```yaml
root:
 - Folder1
 - Folder2
 - File.any
```

Nested folders.

```yaml
root:
  - Folder1:
    - Folder1-1
    - Folder1-2
    - File1-1.js
  - Folder2
  - File.js
```

Use [micromatch's matching features](https://github.com/micromatch/micromatch#matching-features) format to match multiple files/folders

```yaml
root:
  - Routes
    - matcher:
        match: "*.Routes.js"  #don't include dash here (before match)
  - Modals
  - index.js

```

Nest the matcher

```yaml
root:
  - src
    - Components
      - matcher:
          match: "projectName-*"
          root:
            - index.js
    - Dashboard.js
  - index.js
```

**Remember syntax for matcher, don't include dash before match as it will result in error.**

## 2. Get report.

Type following command.

```
structurize
```

***More features in upcoming versions.***
