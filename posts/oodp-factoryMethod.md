---
layout: single
title: "Factory Method 패턴 - OODP"
subtitle: "Factory Method 디자인 패턴에 대한 설명입니다"
date: "2023-05-16"
category: design-pattern
tags: [java, factory-method, factory]
---

## 1. 개요

**Factory Method 디자인 패턴**은 `subclass`에 객체의 생성과 책임 (Responsibilty)을 **위임**하는 디자인 패턴입니다.

## 2. 종류

* 클래스-생성 패턴 입니다.
  
## 3. 사용이유

* **객체 생성 부분을 은닉화**
  
  * `Client`는 어떤 구체적인 클래스의 객체를 생성하는지 알 필요가 없기 때문에 객체 생성 부분을 캡슐화하여 `Client`와 분리시킵니다. 이렇게 하면 `Client` 와 `Product` 객체 간의 결합도를 낮출 수 있습니다.

* **유연성과 확장성**
  
  * `Product` 객체 생성을 추상화하여 새로운 객체 유형을 추가하거나 기존 객체 생성 로직을 변경하는 경우에 용이합니다.

* **`Client` 코드 간소화**
  
  * `Product` 객체 생성에 대한 복잡성을 추상화하여 `Client` 코드를 간결하게 만듭니다.

## 3. 다이어그램

![factorymethod-default](/assets/images/posts/dp/factorymethod-default.png)

### 3.1. 설명

* `Product` 객체를 생성하는 코드는 `Factory` 구현체의 `create()` 에 구현되어 있습니다.

* 추상클래스 `Factory`의 `method()` 를 통해 


### 3.2. 구현

```java
public interface Product {
  public void method();
}

class ProductA implements Product {
  @Override
  public void method() {}
}
class ProductB implements Product {
  @Override
  public void method() {}
}
```

```java
public abstract class Factory {
  public Product factoryMethod() { 
    Product p = create();
    p.method(); 
    return p;
  }
  protected abstract Product create();
}

class FactoryA extends Factory {
  @Override
  protected Product create() { return new ProductA(); }
}

class FactoryB extends Factory {
  @Override
  public Product create() { return new ProductB(); }
}
```

```java
class Client {
  public static void main(String[] args) {
    Product productA = new FactoryA().factoryMethod();
    Product productB = new FactoryB().factoryMethod();
  }
}
```

## 4. 예시


