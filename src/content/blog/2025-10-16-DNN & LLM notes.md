---
title: "DNN & LLM Notes"
date: 2025-10-16
description: "Notes for blog tests."
---

# DNN&LLM

｜Lecturer: 袁坤 Kun Yuan

## Optimization for Deep Learning
---
### Multi-classification
*eg. Face recognition
- Collect the dataset $(hi,yi)$  $hi$ is the feature and $yi$ is the label.
- Consider a linear model to predict the score $s=Xh$.
- **KEY is the $X$!**
- Given the score $s$, the probability of each class with the softmax function is as follows:
	$p_{i}=\frac{exp(s_{i})}{\exp(s_{1})+\exp(s_{2})+\dots+\exp(s_{i})}$ 
	$\sum_{i=1}^np_{i}=1$
### Cross Entropy
- Cross entropy $H(p,q)$ can measure the difference between two distributions $p$ and $q$.
	$H(p,q)={\sum}_{j=1}^n -p_{j}\log(q_{j})$
### Loss Function
- A good model $X^*$ will minimize the discrepancy between predictions and ground-truth.
### Deep Neural Network (DNN)
- A DNN includes a **feature extractor** and a **classifier**.
	eg. Convolutional Neural Network (Convolution + ReLU)
- Training DNN can be formulated into an **optimization** problem. -> **FIND $X$
- Notoriously difficult to train
	- NON-CONVEX TRAINING
	- HUGE DIMENSION
	- HUGE DATASET...

## A Brief Introduction to LLM
---
**MODEL PARAMETER** and FUNCTION: $F(\text{Previous Words}, \theta)$
LLM can be regarded as a magic function that maps the context to the next word.

### Pre-training
- Data collection
- Tokenization (Transform long texts to lists of integers)
- GPUs, time and money...
- Larger = Better?

### Supervised Finetuning
- Base models cannot be deployed directly, possessing knowledge but unable to understand requests.
- Trick it into being AI assistants with prompting, finetuning the model to make it chat like humans.
- **Human Contractors** respond to prompts and generate high-quality answers.

### Reward Modeling
- SFT model generates different responses to the same prompts, then contractors rank the responses.
- DATASET: {Prompt, Response, Reward}

### Reinforcement Learning
- RL makes the model learn to generate responses with great scores -- totally **automatic**.