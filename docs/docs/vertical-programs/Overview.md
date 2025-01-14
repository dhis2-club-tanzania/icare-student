---
sidebar_position: 1
title: Introduction
---

# Vertical Programs

:::info

### Introduction

A program is typically used when a patient is identified as belonging to a group for which a particular set of coordinated interventions is to be followed. For example, programs might be used for diseases such as HIV or tuberculosis or conditions such as pregnancy or interventions such as childhood immunization. This is according to OpenMRS.

[Read More](https://openmrs.atlassian.net/wiki/spaces/docs/pages/25471931/Programs)
.
:::

## iCareConnect Context

The iCareConnect platform make full use of the programs implementation in OpenMRS by, configuration of programs, their workflow(s) and respective states.

To fit into the generic business flow, iCareConnect implementation has implemented APIs for linking patient/client encounters to workflows for the purpose of capturing observations on a respective state.

As far as client journey is concerned, when a client reaches registration desk, registra will be able to enroll this client to a vertical program provided he/she has to be enrolled there. The concept of Vertical Program here is meant to cover specific interventions categoried by health programs clinics like ANC, CTC, TB, NCD etc

## Features in summary

iCareConnect has the following features for Vertical programs/Clinics implementations

- Support to link program with OpenMRS visit types
- Support to enroll a client into respective program/clinic from registration desk.
- Support to set capture observations via encounters linked to workflow states
- Support to capture outcomes of the client on the program/clinic
- Support to refer client to another program
- Support to refer client to doctor for non-clinic services (Normal visit)

## Definitions of some terms

- Program:
- Workflow:
- Workflow state:
- Workflow state trigger:
