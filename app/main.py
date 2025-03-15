from transformers import MarianTokenizer, MarianMTModel

def load_model(model_path="/model"):
    # Load the trained model and tokenizer from the mounted volume
    model = MarianMTModel.from_pretrained(model_path)
    tokenizer = MarianTokenizer.from_pretrained(model_path)
    return model, tokenizer

def translate_text(model, tokenizer, text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128)
    translated_tokens = model.generate(**inputs, max_length=128, num_beams=4, early_stopping=True)
    translated_text = tokenizer.decode(translated_tokens[0], skip_special_tokens=True)
    return translated_text

def main():
    print("Loading translation model...")
    model, tokenizer = load_model()
    
    print("Welcome to the Custom AI Translator!")
    while True:
        text = input("\nEnter text to translate (or 'quit' to exit): ")
        if text.lower() == "quit":
            print("Goodbye!")
            break
        
        translated = translate_text(model, tokenizer, text)
        print(f"Translated text: {translated}")

if __name__ == "__main__":
    main()