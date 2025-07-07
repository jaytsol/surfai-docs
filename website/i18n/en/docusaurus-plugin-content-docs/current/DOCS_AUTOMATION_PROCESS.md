# Docs Automation Process

## Overview

This document describes the process of automating technical documentation for the SurfAI project using Gemini CLI. The goal is to enhance the efficiency of technical documentation, maintain accurate and up-to-date documents, and make them easily accessible and understandable to various stakeholders.

## 1. Problem Statement

The following problems have been identified in the traditional technical documentation process:

1.  **Tedious Manual Work:** Manually writing technical documents requires significant time and effort.
2.  **Difficulty in Diagram/Table Creation:** Creating necessary diagrams and tables for technical documents also consumes a lot of time and effort.
3.  **Need for Multilingual Support:** If the target audience for technical documents is international, additional effort is required for translation.
4.  **Limited Accessibility for Non-Developers:** Technical documents written by developers can be difficult for non-developer team members to understand due to specialized terminology.
5.  **Developer's Difficulty in Writing Non-Developer-Friendly Documents:** It is challenging and cumbersome for developers to write documents in simpler language for non-developer team members due to differences in knowledge scope and level.
6.  **Non-Developer's Difficulty in Writing Technical Documents:** It is also difficult for non-developers to write technical documents as it requires knowledge of newly added or modified modules.

## 2. Proposed Solutions

To address the above problems, the following automation solutions using Gemini CLI have been proposed:

1.  **Automatic Document Reflection:** When developers add or modify new modules and merge them into the main branch, Gemini CLI automatically reflects relevant changes in the `surfai-docs` technical documentation.
2.  **Automatic Inclusion of Diagrams/Tables:** Gemini CLI maintains context on the overall software architecture, technology stack, and database schema, and automatically includes appropriate diagrams and tables (based on Mermaid) in the documents when needed.
3.  **Multilingual Document Support:** After Gemini CLI generates technical documents, it proceeds with translation into necessary languages like English, supporting multilingual documentation.
4.  **Non-Developer-Friendly Document Generation:** After translation, Gemini CLI generates documents that rephrase existing technical documents in simpler language, making them easy for non-developer team members to understand.

## 3. Derived Problems and Solutions

The following derived problems may arise from the proposed solutions, and corresponding solutions have been prepared:

1.  **Accessibility Issues:** While Gemini CLI should handle technical documents alongside code, direct access to Git or code for non-developer team members is not user-friendly.
    *   **Solution:** Distribute technical documents generated via Docusaurus, a Static Site Generator. Docusaurus is a good solution due to its developer-friendly features, Markdown support, and multilingual support.
2.  **Diagram Limitations:** Drawing diagrams for architectural structures, etc., has limitations with pure Gemini CLI.
    *   **Solution:** Use Mermaid, a text-based tool for generating diagrams, flowcharts, and sequence diagrams. The approach is to request Gemini CLI to generate Mermaid text suitable for our project.
3.  **Inconsistency:** Gemini CLI may lack consistency in translation or rephrasing tasks.
    *   **Solution:** Create context files like `.gemini/GEMINI.md` or `PRINCIPLES.md` to clearly define criteria for Gemini CLI to reference during document generation.

## 4. Role of Gemini CLI

The core of this entire process is Gemini CLI. Gemini CLI performs the following roles:

*   **Document Update Trigger:** Gemini CLI initiates document updates when there is an explicit instruction from the user, such as "Add document: [content]" or "Modify document: [content]".
*   **Change Identification:** Based on user instructions, it analyzes changes and collects additional information by exploring the codebase if necessary.
*   **Identification and Modification of Appropriate Documents:** It autonomously identifies and modifies the most suitable documents within `surfai-docs` based on the change content. (The user does not specify particular documents.)
*   **Direct Application of Changes:** After document modification is complete, changes are directly applied to the `main` branch of the `surfai-docs` repository, without pushing.

This automation process will enable more efficient and systematic management of technical documentation for the SurfAI project.
