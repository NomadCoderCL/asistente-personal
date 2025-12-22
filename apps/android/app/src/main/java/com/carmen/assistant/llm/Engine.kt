package com.carmen.assistant.llm

import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

data class GenParams(val context: Int = 1024, val maxNewTokens: Int = 200, val temperature: Float = 0.7f)

object Engine {
    // Placeholder: en producción usar MLC LLM o llama.cpp via JNI
    fun generate(prompt: String, params: GenParams): Flow<String> = flow {
        // Simula streaming
        emit("Respuesta parcial 1...")
        emit("Respuesta parcial 2...")
        emit("<end>")
    }
}
