---
sidebar_position: 2
title: Configuration
---

## Configuration of a vertical program

Given program implementation is powered by OpenMRS, refer to [this link](https://openmrs.atlassian.net/wiki/spaces/docs/pages/25471931/Programs) for other details related to configuring vertical programs. The following are the steps to achieve vertical program features on your iCareConnect EHR implementation.

For a better approach, document implementation approach of your program i.e from names, concepts, workflow states etc as described in the steps before doing actual setup. This will help to communicate with other stakeholders and give you space to find flows and improve accordingly.

#### 1. Set program concept

Any program is tied to concept metadata for different purposes, one being to take advantage of concept metadata to extend different properties of describing the program.

#### 2. Set program outcome concept

The program should also have an outcome concept that will define how enrolled client exit from the program.

#### 3. Create program workflow concepts

Any workflow is tied to a concept, the concept is what describes or defines the workflow. Normally the name of the concept should resemble the name of the workflow [or stage].

#### 4. Configure program

After you have a concept for the program, now you can add program and attach it to the program concept (an actual OpenMRS concept).

#### 5. Configure program workflow

Program must have at least one workflow, and a workflow has at least one state.
[OpenMRS API reference](https://rest.openmrs.org/#program-workflow)

#### 6. Set workflow state forms references

Each workflow state has its own form. Use this key to define one `iCare.programs.settings.workflowStateForms`. For example you have a form mamed `Test` with uuid `2ba8bf91-0954-43e0-a488-0e2a87b1f11c` you will define global property named `.iCare.programs.settings.workflowStateForms.stateuuid` with value equal to a stringified array of forms i.e `[{"uuid":"2ba8bf91-0954-43e0-a488-0e2a87b1f11c","name": "Test"}]`

#### 7. Set visit type reference

Use global property via advanced system settings to set up OpenMRS visit type for Vertical programs. This is the uuid of the OpenMRS visit type that will be a value of global property key `iCare.visits.types.verticalProgram.uuid`

#### 8. Set general forms references

Each Vertical Program is tied to a location for services. The `forms` attribute is used capture general forms to be rendered by the vertical program form interface on the right side bar
