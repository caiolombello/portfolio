import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Obter dados do corpo da requisição
    const data = await request.json()

    // Validar dados
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Aqui seria implementada a lógica para enviar o email
    // usando serviços como SendGrid, Resend, etc.
    console.log("Dados recebidos:", data)

    // Simular um atraso para testar o loading state
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Retornar resposta de sucesso
    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso!" }, { status: 200 })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)

    return NextResponse.json({ error: "Erro ao processar sua mensagem" }, { status: 500 })
  }
}

