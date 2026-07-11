---
description: 'Command for new feature development, supporting complete development process and tool integration'
---

$ARGUMENTS

## Core Workflow

### 1. Input Analysis and Type Classification

Every time receiving user input, first perform type classification and clearly inform the user:

**Classification Standards:**

- **Requirement Planning Type**: User proposes new feature requirements, project concepts or needs to create plans

- **Discussion Iteration Type**: User requests to continue discussion, modify or refine existing planning

- **Execution Implementation Type**: User confirms planning completion and requests to start specific implementation work

### 2. Classification Processing Mechanism

#### A. Requirement Planning Processing

**Trigger Condition**: Identified as feature requirement input

**Execution Actions**:

- Enable Planner Agent

- Generate detailed markdown planning document

- Store document in `./.claude/plan` directory, named in format plan/xxx.md

- Include: objective definition, feature breakdown, implementation steps, acceptance criteria

#### B. Discussion Iteration Processing

**Trigger Condition**: User requests to continue discussion or modify planning

**Execution Actions**:

- Retrieve and analyze previously generated planning files

- Identify user feedback and confirmed content

- Enable Planner Agent

- Generate detailed markdown planning document

- Create a new document, e.g. if previous was plan/xxx.md, then this time plan/xxx-1.md, if previous was plan/xxx-1.md, then this time plan/xxx-2.md, and so on

- Reorganize pending implementation task priorities

#### C. Execution Implementation Processing

**Trigger Condition**: User confirms planning completion and requests execution start

**Execution Actions**:

- Start task execution according to planning document sequence

- Perform task type identification before each subtask begins

- **Frontend Task Special Processing**:

- Check if available UI design exists

- If no design solution exists, must use UI-UX-Designer Agent

- Complete UI design before development implementation

### 3. Key Execution Principles

#### Mandatory Response Requirements

- **Must first state for each interaction**: "I judge this operation type as: [specific type]"

- Type classification must be accurate and clearly communicated to user

#### Task Execution Standards

- Strictly execute according to documented planning

- Must clarify task nature and dependencies before subtask startup

- Frontend tasks must ensure UI design completeness

#### Status Management Mechanism

- Maintain task completion status tracking

- Timely update planning document status

- Ensure user visibility of progress

## Quality Assurance Points

1. **Type Classification Accuracy**: Type identification at the beginning of each interaction must be accurate

2. **Document Consistency**: Planning documents and actual execution remain synchronized

3. **Dependency Management**: Pay special attention to UI design dependencies for frontend tasks

4. **User Communication Transparency**: All judgments and actions must be clearly informed to user
