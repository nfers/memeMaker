import React, { useState, useEffect } from 'react'
import { Wrapper, Image, Title, Card, Templates, Form, Button } from './styles';
import logo from '../../assets/logo.svg'
import { GetApi, PostApi } from '../../services/api';
import qs from 'qs';

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [generatedMeme, setGeneratedMeme] = useState(null);

  useEffect(() => {
    (async () => {
      const resp = await fetch(GetApi);
      const { data: { memes } } = await resp.json();
      setTemplates(memes)
    })();
  }, []);

  const handleInputChange = (index) => (e) => {
    const newValues = boxes;
    newValues[index] = e.target.value;

    setBoxes(newValues);
  }

  function handleSelectedTemplate(template) {
    setSelectedTemplate(template);
    setBoxes([]);
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const params = qs.stringify({
      template_id: selectedTemplate.id,
      username: 'vikayel543',
      password: 'vikayel543',
      boxes: boxes.map(text => ({ text })),
    });

    const res = await fetch(`https://api.imgflip.com/caption_image?${params}`)
    const { data: { url } } = await res.json();

    setGeneratedMeme(url); 
  }

  function handleReset() {
    setSelectedTemplate(null);
    setBoxes([]);
    setGeneratedMeme(null);
  }

  return (
    <Wrapper>
      <Title>MemeMaker</Title><Image src={logo}></Image>
      <Card>
        {generatedMeme && (
          <>
            <img src={generatedMeme} alt={generatedMeme} />
            <Button 
            type="submit"
            onClick={handleReset}
            >
              Criar outro meme
            </Button>
          </>
        )}
        {!generatedMeme && (
          <>
            <h2>Selecione um Template:</h2>
            <Templates>
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleSelectedTemplate(template)}
                  className={template.id === selectedTemplate?.id ? 'selected' : ''}
                >
                  <img src={template.url} alt={template.name} />
                </button>
              ))}
            </Templates>

            {selectedTemplate && (
              <>
                <h2>Textos</h2>
                <Form onSubmit={handleSubmit}>
                  {(new Array(selectedTemplate.box_count)).fill('').map((_, index) => (
                    <input
                      key={String(Math.random())}
                      placeholder={`Text #${index + 1}`}
                      onChange={handleInputChange(index)}
                    />
                  ))}
                  <Button type="submit">Gerar Meme</Button>
                </Form>
              </>
            )}

          </>
        )}
      </Card>
    </Wrapper>
  );
}