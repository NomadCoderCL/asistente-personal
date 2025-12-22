package com.carmen.assistant.setup

import android.content.Context
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File

object ModelManager {
    private val client = OkHttpClient()
    private const val MODEL_URL = "https://example.com/qwen2.5-1.5b-instruct-int4.gguf" // placeholder

    fun modelDir(context: Context): File = File(context.filesDir, "models")

    fun modelFile(context: Context): File = File(modelDir(context), "qwen2.5-1.5b-instruct-int4.gguf")

    fun isModelPresent(context: Context): Boolean = modelFile(context).exists()

    // Descarga simple (sin reanudar). Para producción implementar Range y checksum.
    fun downloadModel(context: Context, onProgress: (Long, Long) -> Unit) {
        val dir = modelDir(context)
        if (!dir.exists()) dir.mkdirs()
        val req = Request.Builder().url(MODEL_URL).build()
        client.newCall(req).execute().use { resp ->
            val body = resp.body ?: return
            val out = modelFile(context).outputStream()
            body.byteStream().use { input ->
                input.copyTo(out)
            }
        }
    }
}
