import tensorflow as tf
import numpy as np

MODEL_1_PATH = r"C:\dev\Confide_CIS6035\Ensemble_models\BEST_model_deeper.weights.h5"
MODEL_2_PATH = r"C:\dev\Confide_CIS6035\Ensemble_models\BEST_model_35pct.weights.h5"
TEST_IMAGE_PATH = r"C:\dev\Confide_CIS6035\Datasets\unrelated\WhatsApp Image 2026-07-22 at 23.14.47 (1).jpeg"

IMG_SIZE = (224, 224)
CLASS_NAMES = ["HPV", "HSV", "Syphilis"]
CONFIDENCE_THRESHOLD = 0.60  # the actual decided value

def build_model():
    base_model = tf.keras.applications.ResNet50(
        input_shape=IMG_SIZE + (3,), include_top=False, weights=None)
    inputs = tf.keras.Input(shape=IMG_SIZE + (3,))
    x = tf.keras.applications.resnet.preprocess_input(inputs * 255.0)
    x = base_model(x, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.5)(x)
    outputs = tf.keras.layers.Dense(3, kernel_regularizer=tf.keras.regularizers.l2(0.01))(x)
    return tf.keras.Model(inputs, outputs)

def load_and_preprocess(path):
    img = tf.io.read_file(path)
    img = tf.image.decode_image(img, channels=3, expand_animations=False)
    img = tf.image.resize(img, IMG_SIZE)
    img = img / 255.0
    return tf.expand_dims(img, axis=0)

print("Loading models...")
model1 = build_model()
model1.load_weights(MODEL_1_PATH)
model2 = build_model()
model2.load_weights(MODEL_2_PATH)
print("Models loaded.\n")

image = load_and_preprocess(TEST_IMAGE_PATH)
probs1 = tf.nn.softmax(model1(image, training=False), axis=1).numpy()[0]
probs2 = tf.nn.softmax(model2(image, training=False), axis=1).numpy()[0]
ensemble_probs = (probs1 + probs2) / 2

predicted_class = CLASS_NAMES[np.argmax(ensemble_probs)]
confidence = float(np.max(ensemble_probs))

print(f"Raw probabilities: {dict(zip(CLASS_NAMES, ensemble_probs.round(3)))}")
print(f"Top prediction: {predicted_class} ({confidence*100:.1f}%)\n")

# ---- This is the actual real-app decision logic ----
if confidence >= CONFIDENCE_THRESHOLD:
    print(f"FINAL OUTPUT: {predicted_class} — {confidence*100:.1f}% confidence")
else:
    print(f"FINAL OUTPUT: Inconclusive (top guess was {predicted_class} at {confidence*100:.1f}%, below the {CONFIDENCE_THRESHOLD*100:.0f}% threshold)")