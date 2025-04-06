import { CheckCircle, AlertCircle } from "lucide-react"

interface FormFeedbackProps {
  type: "success" | "error"
  message: string
}

export default function FormFeedback({ type, message }: FormFeedbackProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md p-4 ${
        type === "success" ? "bg-green-900/20 text-green-400" : "bg-red-900/20 text-red-400"
      }`}
    >
      {type === "success" ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
      <p>{message}</p>
    </div>
  )
}

