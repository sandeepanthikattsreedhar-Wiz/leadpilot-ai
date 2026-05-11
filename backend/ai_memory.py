import chromadb
from sentence_transformers import SentenceTransformer

# ✅ Persistent Chroma DB
client = chromadb.PersistentClient(path="./chroma_db")

collection = client.get_or_create_collection(
    name="documents"
)

# ✅ Embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")


# -----------------------------
# SPLIT LARGE DOCS
# -----------------------------
def chunk_text(text, size=400):
    words = text.split()

    return [
        " ".join(words[i:i + size])
        for i in range(0, len(words), size)
    ]


# -----------------------------
# STORE DOCUMENT
# -----------------------------
def store_document(doc_id, text):
    chunks = chunk_text(text)

    embeddings = model.encode(chunks).tolist()

    collection.add(
        ids=[
            f"{doc_id}_{i}"
            for i in range(len(chunks))
        ],
        documents=chunks,
        embeddings=embeddings
    )


# -----------------------------
# SEARCH SIMILAR
# -----------------------------
def search_similar(query):
    embedding = model.encode([query]).tolist()

    results = collection.query(
        query_embeddings=embedding,
        n_results=3
    )

    return results.get("documents", [])