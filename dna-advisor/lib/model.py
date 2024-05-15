from typing import Optional

from langchain.prompts import PromptTemplate
from langchain_core.embeddings import Embeddings
from langchain_core.language_models.llms import LLM

# GPT4All
from langchain_community.llms.gpt4all import GPT4All
from langchain_community.embeddings.gpt4all import GPT4AllEmbeddings

# LlamaCpp
# from langchain_core.callbacks import CallbackManager, StreamingStdOutCallbackHandler
# from langchain_community.llms.llamacpp import LlamaCpp

from lib.rag import Rag


class Model:
    def __init__(self, model: LLM, embedding: Embeddings, instruction_template: str):
        self._prompt_template = PromptTemplate.from_template(instruction_template)
        self._rag: Optional[Rag] = None
        self._model: LLM = model
        self._embedding: Embeddings = embedding

    def query(self, prompt: str):
        context = ""

        if self._rag:
            context = self._rag.get_context(prompt)

        if self._model:
            formatted_prompt = self._prompt_template.format(
                prompt=prompt, system=context
            )

            # Print the formatted prompt to the console
            print("=====")
            print(formatted_prompt)
            print("=====")

            response = self._model.invoke(formatted_prompt).strip()

            if response.startswith(": "):
                response = response[2:]

            return response

        return None

    def setRagCapabilities(self, rag: Rag):
        self._rag = rag

    def getEmbeddings(self):
        return self._embedding


class GPT4AllModel(Model):
    def __init__(self, model: str, instruction_template: str, **kwargs):
        super().__init__(
            GPT4All(model=model, **kwargs), GPT4AllEmbeddings(), instruction_template
        )


def get_gpt4all_instance(model: str, instruction_template: str, **kwargs) -> Model:
    return GPT4AllModel(model, instruction_template, **kwargs)
