import assert from 'node:assert/strict'
import test from 'node:test'
import { MAX_INPUT_BYTES, MAX_OUTPUT_TOKENS, OpenAIService } from '../src/lib/ai/openai-service'

test('uses strict structured AI scoring with a hard output cap', async () => {
  const originalFetch = globalThis.fetch
  let requestBody: Record<string, unknown> | undefined

  globalThis.fetch = async (_input, init) => {
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>
    return new Response(JSON.stringify({
      status: 'completed',
      output: [{
        content: [{
          type: 'output_text',
          text: JSON.stringify({
            score: 3,
            feedback: 'The response is unrelated to the passage.',
            strengths: [],
            improvements: ['State the passage’s central idea.'],
          }),
        }],
      }],
    }), { status: 200, headers: { 'content-type': 'application/json' } })
  }

  try {
    const result = await new OpenAIService().scoreComprehension({
      passage: 'Pompeii preserves evidence of daily Roman life.',
      summary: 'Purple bicycles negotiate with the moon.',
      provider: { provider: 'openai', model: 'gpt-5-mini', apiKey: 'test-key' },
    })

    assert.equal(result.score, 3)
    assert.equal(requestBody?.max_output_tokens, MAX_OUTPUT_TOKENS)
    assert.equal(requestBody?.store, false)
    assert.equal((requestBody?.text as { format: { type: string } }).format.type, 'json_schema')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('rejects oversized inputs before calling OpenAI', async () => {
  const originalFetch = globalThis.fetch
  let called = false
  globalThis.fetch = async () => {
    called = true
    return new Response()
  }

  try {
    await assert.rejects(
      () => new OpenAIService().scoreComprehension({
        passage: 'x'.repeat(MAX_INPUT_BYTES),
        summary: 'summary',
        provider: { provider: 'openai', model: 'gpt-5-mini', apiKey: 'test-key' },
      }),
      /capped/
    )
    assert.equal(called, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})
