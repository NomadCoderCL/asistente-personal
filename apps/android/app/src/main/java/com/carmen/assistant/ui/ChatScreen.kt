package com.carmen.assistant.ui

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.Button
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun ChatScreen() {
    var prompt by remember { mutableStateOf("") }
    var messages by remember { mutableStateOf(listOf<String>()) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text(text = "Carmen Assistant", style = MaterialTheme.typography.h5)
        Spacer(modifier = Modifier.height(8.dp))
        Column(modifier = Modifier.weight(1f)) {
            for (m in messages) {
                Text(m)
            }
        }

        BasicTextField(value = prompt, onValueChange = { prompt = it }, modifier = Modifier.height(120.dp).fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = {
            messages = messages + "User: $prompt"
            // TODO: generar con Engine.generate
            messages = messages + "AI: (respuesta simulada)"
        }) {
            Text("Enviar")
        }
    }
}
