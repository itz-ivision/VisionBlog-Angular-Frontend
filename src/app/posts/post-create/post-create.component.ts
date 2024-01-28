import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

  postTitle= "";
  postContent = ""

  constructor(public postService: PostService) {}

  onAddPost(form: NgForm) {

    if (form.invalid) {
      alert("Please enter valid data to add post.");
      return;
    }
    // const post: Post = {
    //   title: form.value.title,
    //   content: form.value.content
    // };
    this.postService.addPost(form.value.title, form.value.content);

    form.resetForm();
  }

  // getErrorMessage() {
  //   if(this.postTitle.hasError('required') && (this.postContent.hasError('required'))) {
  //     return "You must enter a valid value to add post."
  //   }
  // }

  getErrorMessage () {
    return "You must enter a valid title and content to add post."
  }

}
