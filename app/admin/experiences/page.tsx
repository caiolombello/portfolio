"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";

interface Experience {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

interface ExperiencesData {
  pt: Experience[];
  en: Experience[];
}

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<ExperiencesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await fetch("/api/admin/experiences");
        if (response.ok) {
          const data = await response.json();
          setExperiences(data);
        } else {
          toast({
            title: "Erro",
            description: "Não foi possível carregar as experiências",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar experiências:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as experiências",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchExperiences();
    }
  }, [toast, isAuthenticated]);

  const handleAddExperience = (lang: "pt" | "en") => {
    if (!experiences) return;

    setExperiences({
      ...experiences,
      [lang]: [
        ...experiences[lang],
        {
          title: "",
          company: "",
          period: "",
          responsibilities: [""],
        },
      ],
    });
  };

  const handleRemoveExperience = (lang: "pt" | "en", index: number) => {
    if (!experiences) return;

    const newExperiences = { ...experiences };
    newExperiences[lang].splice(index, 1);
    setExperiences(newExperiences);
  };

  const handleExperienceChange = (
    lang: "pt" | "en",
    index: number,
    field: keyof Omit<Experience, "responsibilities">,
    value: string,
  ) => {
    if (!experiences) return;

    const newExperiences = { ...experiences };
    newExperiences[lang][index] = {
      ...newExperiences[lang][index],
      [field]: value,
    };
    setExperiences(newExperiences);
  };

  const handleAddResponsibility = (lang: "pt" | "en", expIndex: number) => {
    if (!experiences) return;

    const newExperiences = { ...experiences };
    newExperiences[lang][expIndex].responsibilities.push("");
    setExperiences(newExperiences);
  };

  const handleRemoveResponsibility = (
    lang: "pt" | "en",
    expIndex: number,
    respIndex: number,
  ) => {
    if (!experiences) return;

    const newExperiences = { ...experiences };
    newExperiences[lang][expIndex].responsibilities.splice(respIndex, 1);
    setExperiences(newExperiences);
  };

  const handleResponsibilityChange = (
    lang: "pt" | "en",
    expIndex: number,
    respIndex: number,
    value: string,
  ) => {
    if (!experiences) return;

    const newExperiences = { ...experiences };
    newExperiences[lang][expIndex].responsibilities[respIndex] = value;
    setExperiences(newExperiences);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experiences) return;

    setSaving(true);
    try {
      const response = await fetch("/api/admin/experiences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(experiences),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Experiências atualizadas com sucesso",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar as experiências",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar experiências:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as experiências",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!experiences) {
    return (
      <div className="text-center">
        <p>Não foi possível carregar os dados de experiências.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gold mb-8">
        Gerenciar Experiências
      </h1>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="pt">
          <TabsList className="mb-6">
            <TabsTrigger value="pt">Português</TabsTrigger>
            <TabsTrigger value="en">English</TabsTrigger>
          </TabsList>

          <TabsContent value="pt">
            <div className="space-y-6">
              {experiences.pt.map((experience, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Experiência {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExperience("pt", index)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor={`pt-title-${index}`}
                        className="text-sm font-medium"
                      >
                        Cargo
                      </label>
                      <Input
                        id={`pt-title-${index}`}
                        value={experience.title}
                        onChange={(e) =>
                          handleExperienceChange(
                            "pt",
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor={`pt-company-${index}`}
                        className="text-sm font-medium"
                      >
                        Empresa
                      </label>
                      <Input
                        id={`pt-company-${index}`}
                        value={experience.company}
                        onChange={(e) =>
                          handleExperienceChange(
                            "pt",
                            index,
                            "company",
                            e.target.value,
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor={`pt-period-${index}`}
                        className="text-sm font-medium"
                      >
                        Período
                      </label>
                      <Input
                        id={`pt-period-${index}`}
                        value={experience.period}
                        onChange={(e) =>
                          handleExperienceChange(
                            "pt",
                            index,
                            "period",
                            e.target.value,
                          )
                        }
                        required
                        placeholder="Ex: Jan 2020 - Dez 2022"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          Responsabilidades
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddResponsibility("pt", index)}
                        >
                          <PlusIcon className="h-3 w-3 mr-1" />
                          Adicionar
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {experience.responsibilities.map(
                          (responsibility, respIndex) => (
                            <div
                              key={respIndex}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={responsibility}
                                onChange={(e) =>
                                  handleResponsibilityChange(
                                    "pt",
                                    index,
                                    respIndex,
                                    e.target.value,
                                  )
                                }
                                required
                                placeholder={`Responsabilidade ${respIndex + 1}`}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveResponsibility(
                                    "pt",
                                    index,
                                    respIndex,
                                  )
                                }
                                disabled={
                                  experience.responsibilities.length <= 1
                                }
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                onClick={() => handleAddExperience("pt")}
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Adicionar Nova Experiência
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="en">
            <div className="space-y-6">
              {experiences.en.map((experience, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Experience {index + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExperience("en", index)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor={`en-title-${index}`}
                        className="text-sm font-medium"
                      >
                        Position
                      </label>
                      <Input
                        id={`en-title-${index}`}
                        value={experience.title}
                        onChange={(e) =>
                          handleExperienceChange(
                            "en",
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor={`en-company-${index}`}
                        className="text-sm font-medium"
                      >
                        Company
                      </label>
                      <Input
                        id={`en-company-${index}`}
                        value={experience.company}
                        onChange={(e) =>
                          handleExperienceChange(
                            "en",
                            index,
                            "company",
                            e.target.value,
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor={`en-period-${index}`}
                        className="text-sm font-medium"
                      >
                        Period
                      </label>
                      <Input
                        id={`en-period-${index}`}
                        value={experience.period}
                        onChange={(e) =>
                          handleExperienceChange(
                            "en",
                            index,
                            "period",
                            e.target.value,
                          )
                        }
                        required
                        placeholder="Ex: Jan 2020 - Dec 2022"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          Responsibilities
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddResponsibility("en", index)}
                        >
                          <PlusIcon className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {experience.responsibilities.map(
                          (responsibility, respIndex) => (
                            <div
                              key={respIndex}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={responsibility}
                                onChange={(e) =>
                                  handleResponsibilityChange(
                                    "en",
                                    index,
                                    respIndex,
                                    e.target.value,
                                  )
                                }
                                required
                                placeholder={`Responsibility ${respIndex + 1}`}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveResponsibility(
                                    "en",
                                    index,
                                    respIndex,
                                  )
                                }
                                disabled={
                                  experience.responsibilities.length <= 1
                                }
                                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                onClick={() => handleAddExperience("en")}
                className="w-full"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add New Experience
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
