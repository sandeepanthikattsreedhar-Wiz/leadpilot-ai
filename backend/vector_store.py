import chromadb
from chromadb.utils import embedding_functions

# Local DB
client = chromadb.Client()

# ✅ FREE embedding (NO API KEY NEEDED)
embedding_function = embedding_functions.DefaultEmbeddingFunction()

collection = client.get_or_create_collection(
    name="documents",
    embedding_function=embedding_function
)