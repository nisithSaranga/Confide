<div align="center">

# <img src="frontend/public/logo.png" width="60" height="70" alt="Confide Logo" align="absmiddle"> Confide

**Privacy-preserving, on-device visual screening for HPV, HSV, and syphilis.**

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat&logo=tensorflow&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![On-Device](https://img.shields.io/badge/Inference-100%25%20On--Device-blueviolet?style=flat)

</div>

Confide is a web application that classifies photographs of common male anogenital STI presentations: entirely on the user's own device. No submitted image is ever transmitted to, or stored on, any server. This is not a policy promise; it is a structural property of the architecture, and it is demonstrable: disconnect the backend entirely, and classification still works.

> Final-year BSc (Hons) Software Engineering project, Cardiff Metropolitan University.

---

## Why on-device?

Automated visual screening for these conditions already exists. but every prior system routes the image through a remote server. For an intimate, stigmatised medical image, that upload is often nearly as uncomfortable as the clinical exposure it was meant to replace.

Confide resolves this by converting a trained classification model into a form that runs directly inside the browser. The image is analyzed where it already is. The server never receives it, never sees it, and is structurally incapable of doing either.

---

## How it works

1. **Frame the area** - the user captures or uploads a photo.
2. **On-device skin check** - a lightweight MobileNetV2 classifier confirms the image plausibly shows skin before anything further happens. Non-skin images are rejected immediately, without ever reaching the classification model.
3. **Ensemble classification** - two independently fine-tuned ResNet50 models, differing in backbone unfreeze depth, each produce a prediction. Their outputs are averaged.
4. **Confidence-gated result** - if the ensemble's confidence clears an evidence-based threshold, a result is shown, accompanied by condition-specific guidance and a clear non-diagnostic disclaimer. If not, the result is honestly reported as inconclusive, rather than forced.

All of this - steps 2 through 4 happens entirely in the browser, via TensorFlow.js.

---

## Model performance

The final ensemble was evaluated on a held-out test set never used in training:

| Class | Precision | Recall | F1-score |
|---|---|---|---|
| HPV | 0.796 | 0.684 | 0.736 |
| HSV | 0.784 | 0.806 | 0.795 |
| Syphilis | 0.688 | 0.759 | 0.721 |
| **Overall accuracy** | | | **75.4%** |

The model was reached through a systematic, extensively documented search across more than 20 configurations - architecture selection, regularisation, backbone unfreeze depth, and ensemble composition - with each turning point evidenced and analysed in the accompanying dissertation.

---

## Architecture

```
┌─────────────────────────────┐        ┌──────────────────────────┐
│         CLIENT (browser)     │        │      SERVER (FastAPI)     │
│                               │        │                            │
│  • Skin-detection model      │        │  • Account management     │
│  • Ensemble classification   │◄──────►│  • Result persistence      │
│  • All image processing      │  auth  │    (text-only, opt-in)    │
│                               │  &     │                            │
│  Images NEVER leave here     │  saves │  Never receives an image  │
└─────────────────────────────┘        └──────────────────────────┘
```

The server's role is deliberately narrow: authentication and the optional, consent-based storage of a text-only result (condition + confidence). It has no code path capable of receiving an image, because there is no such path to have.

> **🩺 Privacy is structural, not promised.** Disconnect the backend entirely and classification continues to work without interruption — only authentication and saved-result features depend on it. Nothing in the pipeline was ever built with a way to send an image out.

---

## Tech stack

**Client** - Next.js, TypeScript, Tailwind CSS, TensorFlow.js
**Server** - FastAPI (Python), MongoDB (via Motor), bcrypt, JWT (python-jose)

**Design patterns applied:**
- **Dependency Injection** - FastAPI's `Depends()` centralises identity verification across every protected route
- **Singleton** - module-scoped model caching, preventing redundant multi-hundred-megabyte re-downloads during a session
- **Repository** - all database access mediated through dedicated repository classes, isolating persistence logic from route handlers

---

## Getting started

**Prerequisites:** Node.js, Python 3.11, a MongoDB Atlas connection string.

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Create a `.env` file in `backend/` with your `MONGO_URI`, `JWT_SECRET`, and Gmail credentials for password-reset email delivery. See `.env.example` if provided, or the dissertation's implementation chapter for the full variable list.

The application will be available at `localhost:3000`, with the API at `localhost:8000` (interactive docs at `localhost:8000/docs`).

---

## ⚠️ Known limitations

- **Scope:** trained and validated exclusively on male anogenital presentations. Female anogenital imagery is scarcer still in publicly available clinical repositories, and extension to female presentations is identified as future work.
- **Three conditions only:** HPV, HSV, and syphilis. Other STIs, including gonorrhea, are out of scope, though the model's outlier-exposure training was tested against unseen gonorrhea images as a preliminary robustness probe.
- **Download size:** the full-precision ensemble totals a meaningful download on first visit. Quantization was tested as a mitigation and rejected after a measured accuracy cost.
- **Not a diagnosis:** Confide provides a preliminary indication only. Every result — including a confident one — is accompanied by an explicit disclaimer, and the system exists to lower the barrier to seeking real clinical care, not to replace it.

---

## License & academic context

This repository represents the practical component of an academic dissertation. It is shared publicly for transparency and portfolio purposes. Please reach out before reusing the trained models or dataset-handling code for any purpose involving real patient data.

---

*Built with genuine care about a subject most software never touches honestly.*
