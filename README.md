# Kanban

Kanban is an helper to build kanban boards.

## Example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kanban POC</title>
    <link rel="stylesheet" href="styles.css" />
    <script defer type="module">
      import {Kanban} from './kanban.js';
      const k = new Kanban({selector: '#kanban'});
      k.on('kanban:moved', console.log);
    </script>
  </head>
  <body>
    <section class="kanban" id="kanban">
      <article class="kanban_column" data-columnid="0">
        <header class="column--title">Backlog</header>
        <main class="column--tasks js-kanban-droppable" data-accepts="doing;done" data-status="backlog">
          <article class="kanban--task js-kanban-draggable" id="task-3">Task 3</article>
          <article class="kanban--task js-kanban-draggable" id="task-2">Task 2</article>
          <article class="kanban--task js-kanban-draggable" id="task-6">Task 6</article>
          <article class="kanban--task js-kanban-draggable" id="task-8">Task 8</article>
        </main>
      </article>
      <article class="kanban_column" data-columnid="1">
        <header class="column--title">Doing</header>
        <main class="column--tasks js-kanban-droppable" data-accepts="backlog;done" data-status="doing">
          <article class="kanban--task js-kanban-draggable" id="task-5">Task 5</article>
          <article class="kanban--task js-kanban-draggable" id="task-1">Task 1</article>
          <article class="kanban--task js-kanban-draggable" id="task-9">Task 9</article>
        </main>
      </article>
      <article class="kanban_column" data-columnid="2">
        <header class="column--title">Done</header>
        <main class="column--tasks js-kanban-droppable" data-accepts="doing" data-status="done">
          <article class="kanban--task js-kanban-draggable" id="task-15">Task 15</article>
          <article class="kanban--task js-kanban-draggable" id="task-11">Task 11</article>
          <article class="kanban--task js-kanban-draggable" id="task-19">Task 19</article>
        </main>
      </article>
    </section>  
  </body>
</html>
```