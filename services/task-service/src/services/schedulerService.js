import Task from "../models/Task.js";

export function calculateNextDate(task) {
  const next = new Date(task.scheduledDate);

  if (task.frequency === "daily") {
    next.setDate(next.getDate() + task.interval);
  }

  if (task.frequency === "weekly") {
    next.setDate(next.getDate() + 7 * task.interval);
  }

  if (task.frequency === "monthly") {
    next.setMonth(next.getMonth() + task.interval);
  }

  return next;
}

export async function createNextTask(task) {
  const nextDate = calculateNextDate(task);

  return Task.create({
    name: task.name,
    assignedTo: task.assignedTo,
    verifier: task.verifier,
    frequency: task.frequency,
    interval: task.interval,
    scheduledDate: nextDate,
    // Ensure the new instance inherits the guideline status
    isGuideline: task.isGuideline
  });
}